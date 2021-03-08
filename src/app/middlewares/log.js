export default (request, response, next) => {
  const { method, url } = request;
  const ip =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const logLabel = `[${method.toUpperCase()}] ${url} ${ip}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
};
