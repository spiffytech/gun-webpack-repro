//var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    output: {
        filename: 'main.js',
        path: __dirname + '/dist'
    },
    node: {
        fs: 'empty',
        ws: 'empty',
        os: 'empty',
        net: 'empty',
        url: 'empty',
        path: 'empty',
        http: 'empty',
        https: 'empty',
        dgram: 'empty',
        crypto: 'empty',
        cluster: 'empty',
        'aws-sdk': 'empty',
        'text-encoding': 'empty',
        'child_process': 'empty',
        'node-webcrypto-ossl': 'empty'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],

    resolve: {
        alias: {
            jquery: "gun/examples/jquery.js"
        }
    },
    optimization: {
        minimizer: [
            /*new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        unused: false,
                        collapse_vars: false // debug has a problem in production without this.
                    }
                }
            })*/
        ]
    }
}
