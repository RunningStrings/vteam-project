import io from 'socket.io-client';
import BikeBrain from '../bike-brain';

jest.mock('socket.io-client', () => {
    const mockOn = jest.fn();
    const mockEmit = jest.fn();
    const mockConnect = jest.fn();
    const mockDisconnect = jest.fn();

    const mockSocket = {
        on: mockOn,
        emit: mockEmit,
        connect: mockConnect,
        disconnect: mockDisconnect,
    };

    return jest.fn(() => mockSocket);
});

describe('BikeBrain: mocked controlBike', () => {
    let bike;
    let originalControlBike;
    let mockSocket;

    beforeEach(() => {
        mockSocket = require('socket.io-client')();
        originalControlBike = BikeBrain.prototype.controlBike;
        BikeBrain.prototype.controlBike = jest.fn(); // Mock it for all tests in this suite
        bike = new BikeBrain(1, 55.5965, 12.9963);
    });

    afterEach(() => {
        BikeBrain.prototype.controlBike = originalControlBike;
        jest.restoreAllMocks();
    });

    it('should call controlBike with the correct action when control command is received', () => {
        const controlHandler = mockSocket.on.mock.calls.find(call => call[0] === 'control')?.[1];
        expect(controlHandler).toBeDefined();

        const mockData = { action: 'stop' };
        controlHandler(mockData);

        expect(bike.controlBike).toHaveBeenCalledWith('stop');
    });
});

describe('BikeBrain', () => {
    let bike;
    let mockSocket;

    beforeEach(() => {
        mockSocket = require('socket.io-client')();
        bike = new BikeBrain(1, 55.5965, 12.9963);
        bike.sendMessage = jest.fn();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call socket.io to connect', () => {
        expect(io).toHaveBeenCalledWith('http://localhost:5000');
    });

    it('should log a message when the bike connects to the server', () => {
        const connectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect')[1];
        connectHandler();
        expect(console.log).toHaveBeenCalledWith('Bike 1 connected to the server');
    });

    it('should log a message when the bike disconnects from the server', () => {
        const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
        disconnectHandler();
        expect(console.log).toHaveBeenCalledWith('Bike 1 disconnected from the server');
    });

    it('should set up the control command listener correctly', () => {
        const controlHandler = mockSocket.on.mock.calls.find(call => call[0] === 'control')?.[1];
        expect(controlHandler).toBeDefined();
    });

    it('should call socket.io on connect error', () => {
        const connectErrorHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect_error')?.[1];
        expect(connectErrorHandler).toBeDefined();
    });

    // it('should log a message when the bike connects to the server', () => {
    //     const connectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect')[1];
    //     connectHandler();

    //     expect(console.log).toHaveBeenCalledWith('Bike 1 connected to the server');
    // });

    // it('should log a message when the bike disconnects from the server', () => {
    //     const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
    //     disconnectHandler();

    //     expect(console.log).toHaveBeenCalledWith('Bike 1 disconnected from the server');
    // });

    it('should send a message with the correct event and data', () => {
        const mockEvent = 'update-speed';
        const mockData = { speed: 15 };

        bike.sendMessage(mockEvent, mockData);

        expect(mockSocket.emit).toHaveBeenCalledWith(mockEvent, {
            bikeId: bike.id,
            ...mockData,
        });
    });

    it('should update speed and send the update to the server', () => {
        bike.updateSpeed(15);

        expect(bike.speed).toBe(15);
        expect(bike.sendMessage).toHaveBeenCalledWith('update-speed', { speed: 15 });
    });

    it('should update battery level and send the update to the server', () => {
        bike.updateBattery(85);

        expect(bike.batteryLevel).toBe(85);
        expect(bike.sendMessage).toHaveBeenCalledWith('update-battery', { batteryLevel: 85 });
    });

    it('should start a trip and store trip details', () => {
        const mockCustomerId = 'customer123';
        const mockDate = new Date('2024-12-12T12:00:00Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        bike.startTrip(mockCustomerId);

        expect(bike.tripCurrent).toEqual({
            customerId: mockCustomerId,
            startLat: bike.lat,
            startLon: bike.lon,
            startTime: mockDate,
        });
        expect(console.log).toHaveBeenCalledWith(`Trip started for customer ${mockCustomerId} at ${mockDate}`);
    });

    it('should stop a trip, log the trip, and reset tripCurrent', () => {
        const mockStartTime = new Date('2024-12-12T12:00:00Z');
        const mockStopTime = new Date('2024-12-12T13:00:00Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockStartTime).mockImplementationOnce(() => mockStopTime);

        bike.tripCurrent = {
            customerId: 'customer123',
            startLat: bike.lat,
            startLon: bike.lon,
            startTime: mockStartTime,
        };
        bike.stopTrip();

        expect(bike.tripCurrent).toBeNull();
        expect(bike.tripLog).toHaveLength(1);
        expect(bike.tripLog[0]).toEqual({
            customerId: 'customer123',
            startLat: bike.lat,
            startLon: bike.lon,
            startTime: mockStartTime,
            stopLat: bike.lat,
            stopLon: bike.lon,
            stopTime: mockStopTime,
        });
        expect(bike.sendMessage).toHaveBeenCalledWith('log-trip', { tripLog: bike.tripLog });
        expect(console.log).toHaveBeenCalledWith(`Trip ended for customer customer123 at ${mockStopTime}`);
    });


    it('should do nothing in stopTrip if tripCurrent is null', () => {
        bike.stopTrip();

        expect(bike.tripCurrent).toBeNull();
        expect(bike.tripLog).toHaveLength(0);
        expect(bike.sendMessage).not.toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
    });

    it('should initialize a bike with the expected properties', () => {
        expect(bike.id).toBe(1);
        expect(bike.lat).toBe(55.5965);
        expect(bike.lon).toBe(12.9963);
        expect(bike.speed).toBe(0);
        expect(bike.status).toBe('available');
        expect(bike.batteryLevel).toBe(100);
    });

    it('should call socket.io to connect', () => {
        expect(io).toHaveBeenCalledWith('http://localhost:5000');
    });

    it('should update position and send the update to the server', () => {
        bike.sendMessage = jest.fn();

        bike.updatePosition(55.5947, 13.0088);
        expect(bike.lat).toBe(55.5947);
        expect(bike.lon).toBe(13.0088);
        expect(bike.sendMessage).toHaveBeenCalledWith('update-position', {
            lat: 55.5947,
            lon: 13.0088,
        });
    });

    it('should start a rental if the bike is available', () => {
        const mockCustomerId = 'customer123';
        bike.startTrip = jest.fn();

        bike.startRental(mockCustomerId);

        expect(bike.status).toBe('in-use');
        expect(bike.startTrip).toHaveBeenCalledWith(mockCustomerId);
    });

    it('should not start a rental if the bike is not available', () => {
        bike.status = 'charging';
        bike.startTrip = jest.fn();

        bike.startRental('customer123');

        expect(bike.status).toBe('charging');
        expect(bike.startTrip).not.toHaveBeenCalled();
    });

    it('should stop a rental and reset the bike status', () => {
        bike.status = 'in-use';
        bike.tripCurrent = {
            customerId: 'customer123',
            startLat: bike.lat,
            startLon: bike.lon,
            startTime: new Date(),
        };
        bike.stopTrip = jest.fn();

        bike.stopRental();

        expect(bike.status).toBe('available');
        expect(bike.stopTrip).toHaveBeenCalled();
    });

    it('should log a message and return early if the bike is not in use', () => {
        bike.status = 'available';
        bike.stopTrip = jest.fn();
        bike.bikeLight = jest.fn();

        bike.stopRental();

        expect(console.log).toHaveBeenCalledWith('Bike not in use');
        expect(bike.stopTrip).not.toHaveBeenCalled();
        expect(bike.bikeLight).not.toHaveBeenCalled();
    });

    it('should handle admin control actions', () => {
        bike.controlBike('stop');
        expect(bike.status).toBe('available');
        expect(bike.speed).toBe(0);

        bike.controlBike('service');
        expect(bike.status).toBe('in-service');

        bike.controlBike('charge');
        expect(bike.status).toBe('charging');
    });
});
