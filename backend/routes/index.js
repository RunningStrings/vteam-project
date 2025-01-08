/**
 * Routes configuration.
 */
import { router as userRouter } from './users.js';
import { router as cityRouter } from './cities.js';
import { router as bikeRouter } from './bikes.js';
import { router as stationRouter } from './chargingStations.js';
import { router as zoneRouter } from './parkingZones.js';
import { router as tripRouter } from './trips.js';

// import userRouter from 'userRouter.js';
// import cityRouter from 'cityRouter.js';
// import bikeRouter from './routers/bikeRouter.js';
// import stationRouter from './routers/stationRouter.js';
// import zoneRouter from './routers/zoneRouter.js';
// import tripRouter from './routers/tripRouter.js';

const allRoutes = (app, version) => {
  const routes = [
    { path: "/users", router: userRouter },
    { path: "/cities", router: cityRouter },
    { path: "/bikes", router: bikeRouter },
    { path: "/charging_stations", router: stationRouter },
    { path: "/parking_zones", router: zoneRouter },
    { path: "/trips", router: tripRouter }
  ];

  routes.forEach(route => {
    app.use(version + route.path, route.router);
  });
};

export default allRoutes;
