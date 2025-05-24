module.exports = {
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  }
};