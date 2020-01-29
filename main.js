var fs = require('fs')
var path = require('path')
var https = require('https');
var express = require('express')
var log4js = require('log4js')
var log = log4js.getLogger()
var Config = require('./conf/conf')

log.level = Config.LogLevel;
var lastActiveTime = ""
var app = express()
var allCityStr = fs.readFileSync(__dirname + path.sep + 'www' + path.sep + 'data' + path.sep + 'allCity.csv').toString()
var allCity = allCityStr.split('\n')
log.info("Load All City Geo Data Success.[Count:" + allCity.length + "]")

var OriginData = []
var GeoData = []
var NewsData = []


GetData()
setInterval(function () {
    GetData()
}, 1000 * 60)
app.use('/', express.static(__dirname + path.sep + Config.WebDir))
app.get('/api',function(req,res){
    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" })
    if(req.query.type == "getGeo")
    {
        res.end(JSON.stringify(GeoData.list))
    }
    else if(req.query.type == "getNews")
    {
        res.end(JSON.stringify(NewsData))
    }
    else if(req.query.type == "getCityCount")
    {
        var result = []
        for(var i=0;i<OriginData.length;i++)
        {
            for(var j=0;j<OriginData[i].cities.length;j++)
            {
                var temp = {
                    provinceName: OriginData[i].provinceName,
                    cityName: OriginData[i].cities[j].cityName,
                    confirmedCount:OriginData[i].cities[j].confirmedCount,
                    suspectedCount:OriginData[i].cities[j].suspectedCount,
                    curedCount:OriginData[i].cities[j].curedCount,
                    deadCount:OriginData[i].cities[j].deadCount
                }
                result.push(temp)
            }
        }
        res.end(JSON.stringify(result))
    }
    else if(req.query.type == "getProvinceCount")
    {
        var result = []
        for(var i=0;i<OriginData.length;i++)
        {
            var temp = {
                provinceName:OriginData[i].provinceName,
                confirmedCount:OriginData[i].confirmedCount,
                suspectedCount:OriginData[i].suspectedCount,
                curedCount:OriginData[i].curedCount,
                deadCount:OriginData[i].deadCount
            }
            result.push(temp)
        }
        res.end(JSON.stringify(result))
    }
    else if(req.query.type == "getCount")
    {
        var result = []
        for(var i=0;i<OriginData.length;i++)
        {
            var temp = OriginData[i]
            delete temp.comment
            result.push(temp)
        }
        res.end(JSON.stringify(result))
    }
    else if(req.query.type == "getAllCount")
    {
        var result = {
            confirmedCount:0,
            suspectedCount:0,
            curedCount:0,
            deadCount:0
        }
        for(var i=0;i<OriginData.length;i++)
        {
            result.confirmedCount += OriginData[i].confirmedCount
            result.suspectedCount += OriginData[i].suspectedCount
            result.curedCount += OriginData[i].curedCount
            result.deadCount += OriginData[i].deadCount
        }
        res.end(JSON.stringify(result))
    }
    else
    {
        res.end(JSON.stringify({
            error:"Can't Find Type!"
        }))
    }
})

var server = app.listen(Config.Port, Config.Hostname, function () {
    var host = server.address().address
    var port = server.address().port
    log.info("Server Listening on " + host + ":" + port + '.')
})

function updateLastActiveTime() {
    var date = new Date()
    lastActiveTime = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
}
function between(key1, key2, str) {
    var m = str.match(new RegExp(key1 + '(.*?)' + key2));
    return m ? m[1] : false;
}
function getGeoXY(cityName) {
    for (var i = 0; i < allCity.length; i++) {
        var temp = allCity[i].split(',')
        if (temp[1].search(cityName) != -1) {
            return {
                x: temp[2],
                y: temp[3]
            }
        }
    }
    return false
}
function GetData() {
    https.get('https://3g.dxy.cn/newh5/view/pneumonia', function (req, res) {
        let html = '';
        req.on('data', function (data) {
            html += data;
        });
        req.on('end', function () {
            //console.log(html)
            GetNews(html)
            html = between("<script id=\"getAreaStat\">", "</script><script id=", html)
            if (!html) {
                log.error("Get Data Error")
                return
            }
            html = html.replace("try { window.getAreaStat = ", "")
            html = html.replace("}catch(e){}", "")
            try {
                var json = JSON.parse(html)
                OriginData = json
                var addresses = new Array()
                for (var i = 0; i < json.length; i++) {
                    for (var j = 0; j < json[i].cities.length; j++) {
                        var geo = getGeoXY(json[i].cities[j].cityName)
                        if (geo != false) {
                            addresses.push({
                                provinceName: json[i].provinceName,               //省名
                                cityName: json[i].cities[j].cityName,             //市名
                                x: geo.x,                                         //地理坐标X
                                y: geo.y,                                         //地理坐标Y
                                confirmedCount: json[i].cities[j].confirmedCount, //确诊
                                suspectedCount: json[i].cities[j].suspectedCount, //疑似
                                curedCount: json[i].cities[j].curedCount,         //治愈
                                deadCount: json[i].cities[j].deadCount            //死亡
                            })
                        }
                    }
                }
                var output = {
                    unit: "人",
                    eleValue: "provinceName,cityName,x,y,confirmedCount,suspectedCount,curedCount,deadCount",
                    dateTime: lastActiveTime,
                    list: addresses
                }
                fs.writeFile(__dirname + path.sep + Config.WebDir + path.sep + 'data' + path.sep + 'city.json', JSON.stringify(output), function (error) {
                    if (error) {
                        log.info("Write City Data Error.")
                    } else {
                        log.info("Write City Data Success.Last Active Time: " + lastActiveTime)
                        GeoData = output
                        updateLastActiveTime()
                    }
                })
            } catch (e) {
                log.error("Get Data Error:", e)
            }
        });
    });
}

function GetNews(html) {
    html = between("<script id=\"getTimelineService\">", "</script><script id=", html)
    if (!html) {
        log.error("Get New Data Error")
        return
    }
    html = html.replace("try { window.getTimelineService = ", "")
    html = html.replace("}catch(e){}", "")
    try {
        var json = JSON.parse(html)
        var infos = []
        for(var i=0;i<json.length;i++)
        {
            var date = new Date(json[i].pubDate)
            var temp = {
                date:  date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString(),
                date1: date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" +  date.getDate().toString(),
                date2: date.getHours().toString() + ':' + date.getMinutes().toString(),
                title: json[i].title,
                main:  json[i].summary,
                source:json[i].infoSource
            }
            infos.push(temp)
        }
        NewsData = infos
        log.info("Get News Data Success.Last Active Time:",lastActiveTime)
    } catch (e) {
        log.error("Get New Data Error:", e)
    }
}