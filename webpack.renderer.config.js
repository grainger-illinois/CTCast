const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve:{
    
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"), 
      "stream": require.resolve("stream-browserify"), 
      "util": require.resolve("util/"),
      "events": require.resolve("events/") 

    }
  },
};
