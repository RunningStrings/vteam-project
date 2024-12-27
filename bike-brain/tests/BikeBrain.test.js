import io from 'socket.io-client';
import BikeBrain from '../bike-brain';

const MOCK_BIKE_ID = 1;
const MOCK_CITY_ID = 'Stockholm';
const MOCK_LAT = 55.5965;
const MOCK_LON = 12.9963;
const MOCK_CUSTOMER_ID = 'customer123';
const MOCK_DATE = new Date('2024-12-12T12:00:00Z');

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

const getMockHandlerForEvent = (eventName, mockSocket) => {
    return mockSocket.on.mock.calls.find(call => call[0] === eventName)?.[1];
};

// Isolated for controlBike
describe('BikeBrain: mocked controlBike', () => {
    let bike;
    let originalControlBike;
    let mockSocket;

    beforeEach(() => {
        mockSocket = require('socket.io-client')();
        originalControlBike = BikeBrain.prototype.controlBike;
        BikeBrain.prototype.controlBike = jest.fn();
        bike = new BikeBrain(MOCK_BIKE_ID, MOCK_CITY_ID, MOCK_LAT, MOCK_LON);
    });

    afterEach(() => {
        BikeBrain.prototype.controlBike = originalControlBike;
        jest.restoreAllMocks();
    });

    it('should call controlBike with the correct action when control command is received', () => {
        const controlHandler = getMockHandlerForEvent('control', mockSocket);
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
        bike = new BikeBrain(MOCK_BIKE_ID, MOCK_CITY_ID, MOCK_LAT, MOCK_LON);
        bike.sendMessage = jest.fn();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Socket Communication', () => {
        it('should call socket.io to connect', () => {
            expect(io).toHaveBeenCalledWith('http://localhost:5001');
        });

        it('should log a message when the bike connects to the server', () => {
            const connectHandler = getMockHandlerForEvent('connect', mockSocket);
            connectHandler();
            expect(console.log).toHaveBeenCalledWith('Bike 1 connected to the server');
        });

        it('should log a message when the bike disconnects from the server', () => {
            const disconnectHandler = getMockHandlerForEvent('disconnect', mockSocket);
            disconnectHandler();
            expect(console.log).toHaveBeenCalledWith('Bike 1 disconnected from the server');
        });

        it('should set up the control command listener correctly', () => {
            const controlHandler = getMockHandlerForEvent('control', mockSocket);
            expect(controlHandler).toBeDefined();
        });

        it('should call socket.io on connect error', () => {
            const connectErrorHandler = getMockHandlerForEvent('connect_error', mockSocket);
            expect(connectErrorHandler).toBeDefined();
        });

        it('should log an error message when connect_error occurs', () => {
            const mockError = new Error('Mock connection error');
            const connectErrorHandler = getMockHandlerForEvent('connect_error', mockSocket);

            expect(connectErrorHandler).toBeDefined();

            jest.spyOn(console, 'error').mockImplementation(() => {});

            connectErrorHandler(mockError);

            expect(console.error).toHaveBeenCalledWith(`Connection error for bike ${bike.id}:`, mockError);

            console.error.mockRestore();
        });

        describe('Socket Communication: sendMessage', () => {
            let bike;
            let mockSocket;
        
            beforeEach(() => {
                mockSocket = {
                    emit: jest.fn(),
                };
        
                bike = new BikeBrain(MOCK_BIKE_ID, MOCK_CITY_ID, MOCK_LAT, MOCK_LON);
                bike.socket = mockSocket;
            });
        
            afterEach(() => {
                jest.restoreAllMocks();
            });
        
            it('should send a message with the correct event and data', () => {
                const mockEvent = 'update-speed';
                const mockData = { speed: 15 };
        
                bike.sendMessage(mockEvent, mockData);
        
                expect(mockSocket.emit).toHaveBeenCalledWith(mockEvent, {
                    bikeId: bike.id,
                    ...mockData,
                });
            });
        });

        describe('Socket Communication: disconnect', () => {
            let bike;
            let mockSocket;

            beforeEach(() => {
                mockSocket = {
                    disconnect: jest.fn(),
                };

                bike = new BikeBrain();
                bike.socket = mockSocket;
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should call disconnect on the socket if it exists', () => {
                bike.disconnect();

                expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
            });

            it('should do nothing if the socket does not exist', () => {
                bike.socket = undefined;

                bike.disconnect();

                expect(mockSocket.disconnect).not.toHaveBeenCalled();
            });
        });
    });

    describe('Trip and Rental Functionality', () => {
        it('should start a trip and store trip details', () => {
            const mockCustomerId = MOCK_CUSTOMER_ID;
            const mockDate = new Date(MOCK_DATE);
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

            bike.startTrip(mockCustomerId);

            expect(bike.tripCurrent).toEqual({
                customerId: mockCustomerId,
                startLocation: {
                    lat: bike.location.coordinates[0],
                    lon: bike.location.coordinates[1],
                },
                startTime: mockDate,
            });
            expect(console.log).toHaveBeenCalledWith(`Trip started for customer ${mockCustomerId} at ${mockDate}`);
        });

        it('should stop a trip, log the trip, and reset tripCurrent', () => {
            const mockStartTime = new Date(MOCK_DATE);
            const mockStopTime = new Date('2024-12-12T13:00:00Z');
            jest.spyOn(global, 'Date').mockImplementation(() => mockStartTime).mockImplementationOnce(() => mockStopTime);

            bike.tripCurrent = {
                customerId: MOCK_CUSTOMER_ID,
                startLat: bike.location.coordinates[0],
                startLon: bike.location.coordinates[1],
                startTime: mockStartTime,
            };
            bike.stopTrip();

            expect(bike.tripCurrent).toBeNull();
            expect(bike.tripLog).toHaveLength(1);
            expect(bike.tripLog[0]).toEqual({
                customerId: MOCK_CUSTOMER_ID,
                startLat: bike.location.coordinates[0],
                startLon: bike.location.coordinates[1],
                startTime: mockStartTime,
                stopLocation: {
                    lat: bike.location.coordinates[0],
                    lon: bike.location.coordinates[1],
                },
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

        it('should start a rental if the bike is available', () => {
            const mockCustomerId = MOCK_CUSTOMER_ID;
            bike.startTrip = jest.fn();

            bike.startRental(mockCustomerId);

            expect(bike.status).toBe('in-use');
            expect(bike.startTrip).toHaveBeenCalledWith(mockCustomerId);
        });

        it('should not start a rental if the bike is not available', () => {
            bike.status = 'maintenance';
            bike.startTrip = jest.fn();

            bike.startRental(MOCK_CUSTOMER_ID);

            expect(bike.status).toBe('maintenance');
            expect(bike.startTrip).not.toHaveBeenCalled();
        });

        it('should stop a rental and reset the bike status', () => {
            bike.status = 'in-use';
            bike.tripCurrent = {
                customerId: MOCK_CUSTOMER_ID,
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
    });

    describe('Bike Functionality', () => {
        it('should initialize a bike with the expected properties', () => {
            expect(bike.id).toBe(1);
            expect(bike.location.coordinates[0]).toBe(MOCK_LAT);
            expect(bike.location.coordinates[1]).toBe(MOCK_LON);
            expect(bike.speed).toBe(0);
            expect(bike.status).toBe('available');
            expect(bike.batteryLevel).toBe(100);
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

        it('should update location and send the update to the server', () => {
            bike.updateLocation(55.5947, 13.0088);
            expect(bike.location.coordinates[0]).toBe(55.5947);
            expect(bike.location.coordinates[1]).toBe(13.0088);
            expect(bike.sendMessage).toHaveBeenCalledWith('update-location', {
                location: {
                    coordinates: [55.5947, 13.0088],
                    type: "Point",
                },
            });
        });

        if('should log blue when bike status is in-use', () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});

            bike.bikeLight('in-use');

            expect(console.log).toHaveBeenCalledWith('blue');

            console.log.mockRestore();
        })

        it('should return bike data in the correct format', () => {
            const expectedData = {
                city_id: bike.cityId,
                location: bike.location,
                status: bike.status,
                battery_level: bike.batteryLevel,
                speed: bike.speed,
            };

            const result = bike.getBikeData();

            expect(result).toEqual(expectedData);
        });

        describe('BikeBrain: autocharge functionality', () => {
            let bike;
        
            beforeEach(() => {
                bike = new BikeBrain(MOCK_BIKE_ID, MOCK_CITY_ID, MOCK_LAT, MOCK_LON);
                jest.spyOn(console, 'log').mockImplementation(() => {});
                jest.spyOn(bike, 'controlBike').mockImplementation(() => {});
            });
        
            afterEach(() => {
                jest.restoreAllMocks();
            });
        
            it('should log the correct message and call controlBike with "charge"', () => {
                bike.autoCharge();
        
                expect(console.log).toHaveBeenCalledWith(
                    `Bike ${bike.id} is being charged at a charging station`
                );
                expect(bike.controlBike).toHaveBeenCalledWith('charge');
            });
        });
    });

    describe('Admin Control', () => {
        it('should handle admin control actions', () => {
            bike.controlBike('stop');
            expect(bike.status).toBe('maintenance');
            expect(bike.speed).toBe(0);

            bike.controlBike('maintenance');
            expect(bike.status).toBe('maintenance');

            bike.controlBike('charge');
            expect(bike.status).toBe('charging');
        });
    });
});
