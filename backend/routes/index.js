/**
 * Routes configuration.
 */
import { router as userRouter } from './users.js';
import { router as cityRouter } from './cities.js';
import { router as bikeRouter } from './bikes.js';
import { router as stationRouter } from './chargingStations.js';
import { router as zoneRouter } from './parkingZones.js';
import { router as tripRouter } from './trips.js';
import { router as loginRouter } from './login.js';

const allRoutes = (app, version) => {
  const routes = [
    { path: "/users", router: userRouter },
    { path: "/cities", router: cityRouter },
    { path: "/bikes", router: bikeRouter },
    { path: "/charging_stations", router: stationRouter },
    { path: "/parking_zones", router: zoneRouter },
    { path: "/trips", router: tripRouter },
    { path: "/login", router: loginRouter }
  ];

  routes.forEach(route => {
    app.use(version + route.path, route.router);
  });
};

export default allRoutes;
