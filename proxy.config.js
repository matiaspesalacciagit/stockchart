const PROXY_CONFIG = [
    {
        context: [
            "/token",
            "/api/v2"
        ],
        target: "https://api.invertironline.com",
        secure: false,
        changeOrigin: true
    }
]
 
module.exports = PROXY_CONFIG;