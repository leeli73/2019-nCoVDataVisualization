##2019-nCoV Data Visualization是什么?
2019-nCoV Data Visualization是一个新型肺炎疫情的数据可视化平台

主要用于一些大屏幕的数据显示

疫情数据主要来源于丁香园(dxy.cn)，Geo数据由本人自己维护(www/data/geoinfo-all.json)

主要使用了Antx L7，Echarts，Vue，jQuery等技术(本人也只是一个小菜鸡，只是响应国家号召，在家学习制作了本平台)

![demo](https://raw.githubusercontent.com/leeli73/2019-nCoVDataVisualization/master/media/demo.jpg)

##2019-nCoV Data Visualization有哪些功能？

* 疫情数据的3D柱状图显示
* 实时疫情统计数据的显示
* 实时各省市疫情可视化显示
* 实时疫情动态显示
* 另外还提供了多个API接口
    * /api?type=getGeo //包含地理信息的疫情信息获取
```json
  [{"provinceName":"湖北省","cityName":"武汉","x":"114.305469","y":"30.593175","confirmedCount":1905,"suspectedCount":0,"curedCount":54,"deadCount":104},...]
```
    * /api?type=getNews //获取最新的疫情动态
```json
  [{"date":"2020-1-30 0:16","date1":"2020/1/30","date2":"0:16","title":"武汉首例高龄重症病人康复出院","main":"【好消息！#武汉首例高龄重症病人康复出院#】1月29号，一位78岁高龄的新型冠状病毒感染的肺炎重症患者，经过医护人员的治疗，从同济医院隔离病房康复出院，这是目前武汉市首个高龄重症患者治愈的病例。据介绍，本月初，卢先生在打兵乓球时不慎接触到被感染的球友，出现发热、乏力等症状，1月9号到同济医院接受隔离治疗。此前卢先生患有二十多年的高血压和糖尿病，入院后病情逐渐加重，1月18号出现危重症状。经过同济医院医护团队的全力救治，4天后，卢先生的病情得到缓解。","source":"人民日报"},...]
```
    * /api?typ=getCityCount //获取各城市的疫情数据
```json
  [{"provinceName":"湖北省","cityName":"武汉","confirmedCount":1905,"suspectedCount":0,"curedCount":54,"deadCount":104},...]
```
    * /api?type=getProvinceCount //获取各省的疫情数据
```json
  [{"provinceName":"湖北省","confirmedCount":3554,"suspectedCount":0,"curedCount":88,"deadCount":125},...]
```
    * /api?type=getCount //获取所有的疫情数据
```json
  [{"provinceName":"湖北省","provinceShortName":"湖北","confirmedCount":3554,"suspectedCount":0,"curedCount":88,"deadCount":125,"cities":[{"cityName":"武汉","confirmedCount":1905,"suspectedCount":0,"curedCount":54,"deadCount":104},{"cityName":"黄冈","confirmedCount":324,"suspectedCount":0,"curedCount":2,"deadCount":5},{"cityName":"孝感","confirmedCount":274,"suspectedCount":0,"curedCount":0,"deadCount":3},{"cityName":"荆门","confirmedCount":142,"suspectedCount":0,"curedCount":0,"deadCount":4},{"cityName":"襄阳","confirmedCount":131,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"随州","confirmedCount":116,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"咸宁","confirmedCount":112,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"荆州","confirmedCount":101,"suspectedCount":0,"curedCount":1,"deadCount":2},{"cityName":"十堰","confirmedCount":88,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"黄石","confirmedCount":86,"suspectedCount":0,"curedCount":0,"deadCount":1},{"cityName":"鄂州","confirmedCount":84,"suspectedCount":0,"curedCount":0,"deadCount":1},{"cityName":"宜昌","confirmedCount":63,"suspectedCount":0,"curedCount":0,"deadCount":1},{"cityName":"恩施州","confirmedCount":51,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"天门","confirmedCount":34,"suspectedCount":0,"curedCount":0,"deadCount":3},{"cityName":"仙桃","confirmedCount":32,"suspectedCount":0,"curedCount":0,"deadCount":0},{"cityName":"潜江","confirmedCount":8,"suspectedCount":0,"curedCount":0,"deadCount":1},{"cityName":"神农架林区","confirmedCount":3,"suspectedCount":0,"curedCount":0,"deadCount":0}]}...]
```
    * /api?type=getAllCount //获取疫情总数
```json
  {"confirmedCount":6095,"suspectedCount":1,"curedCount":120,"deadCount":133}
```


##感激
感谢以下的项目,排名不分先后

* [丁香园](https://3g.dxy.cn/newh5/view/pneumonia) 
* [Antx L7](https://antv-l7.gitee.io/zh)
* [jQuery](http://jquery.com)
* [EChart](https://www.echartsjs.com/zh/index.html)
* [Vue.JS](https://cn.vuejs.org/)
