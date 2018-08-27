/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { RouteHandler, Route, DefaultRoute } = ReactRouter;

const routes = React.createElement(
  Route,
  { path: '/' },
  React.createElement(DefaultRoute, { name: 'welcome', handler: RouteWelcome }),
);

window.Router = ReactRouter.run(routes, Handler =>
  React.render(
    React.createElement(Handler, null),
    document.getElementById('application'),
  ),
);
