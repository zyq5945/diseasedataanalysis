
## 1.介绍说明

diseasedataanalysis是一个对疾病数据进行分析查看的HTML5网页项目。

本项目目前是针对BlankerL发布的[DXY-COVID-19-Data](https://github.com/BlankerL/DXY-COVID-19-Data)的最新DXYArea.csv文件，生成整理后的数据仓库[DXY-COVID-19-Data-Arrange-DJSON](https://github.com/zyq5945/DXY-COVID-19-Data-Arrange-DJSON)的数据进行显示，包括各省份和市区的详细的病例数，康复数，死亡数，在治数（正在治疗的数量的缩写，即累计病例数减去康复数与死亡数），康复率，死亡率和在治率等数据按日期发展的详细情况显示，还能对各省份和市区的数据进行对比，甚至是省份与市区的数据对比，方便发现一些疾病规律，并使用了Boltzmann模型【y = A2 + (A1-A2)/(1 + exp((x-x0)/dx))】对康复情况进行了数据仿真，也使用简单的一次线性模型【y=kx+b】对死亡情况进行了数据仿真，可以在页面调整仿真参数，并查看修改参数后的仿真结果。

若你对生成的数据有疑问，或者认为汇总的数据有误，请向[BlankerL反馈异常数据](https://github.com/BlankerL/DXY-COVID-19-Crawler/issues/34)。

本项目使用[d3.js](https://d3js.org/)进行数据显示，使用了一些javascript高版本API，无法保证对各浏览器的兼容性，若显示有问题，请使用最新版本的Chrome或者Firefox浏览器来浏览。

## 2.疾病数据查看分析主页

[github.io 疾病数据查看分析主页](https://zyq5945.github.io/diseasedataanalysis/overview.html)

[gitee.io 疾病数据查看分析主页](https://zyq5945.gitee.io/diseasedataanalysis/overview.html)

## 3.不同的数据地址

所有的数据地址都必须保证在浏览器中输入“数据地址+/Total.json”都能顺利返回[diseasedataarrange整理且符合本程序使用规范的JSON数据](https://zyq5945.github.io/diseasedataarrange)，否则就是错误的数据地址。

比如：https://zyq5945.github.io/DXY-COVID-19-Data-Arrange-DJSON/data/Total.json

### 3.1 中国COVID-19(2019-nCov/新型冠状病毒)数据

针对可能对不同网站访问速度有快慢问题，酌情可以考虑以下最快的访问地址：

#### github.io 网站：[https://zyq5945.github.io/DXY-COVID-19-Data-Arrange-DJSON](https://zyq5945.github.io/diseasedataanalysis/overview.html?DataUrl=https://zyq5945.github.io/DXY-COVID-19-Data-Arrange-DJSON/data)

#### gitee.io 网站：[https://zyq5945.gitee.io/dxy-covid-19-data-arrange-djson/data](https://zyq5945.gitee.io/diseasedataanalysis/overview.html?DataUrl=https://zyq5945.gitee.io/dxy-covid-19-data-arrange-djson/data)

#### github.com 仓库：https://raw.githubusercontent.com/zyq5945/DXY-COVID-19-Data-Arrange-DJSON/master/data

#### gitee.com 仓库：https://gitee.com/zyq5945/DXY-COVID-19-Data-Arrange-DJSON/raw/master/data


可能访问有的数据地址是无法获取数据的，是因通常情况下浏览器会因CORS安全机制问题，使得所有请求的未加Access-Control-Allow-Origin标识的数据都会失败。若仍需要访问其他数据地址，请下载代码后新建Chrome浏览器的快捷方式，修改其目标参数类似如下来进行浏览：

注：数据计算的开始时间点是2020-01-24。

```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "C:\project\html\diseasedataanalysis\overview.html" --disable-web-security --user-data-dir="C:\temp\chrome"
```

### 3.2 使用nginx自建数据地址

下载相应的[DXY-COVID-19-Data-Arrange-DJSON](https://github.com/zyq5945/DXY-COVID-19-Data-Arrange-DJSON)数据仓库后，修改nginx的配置文件nginx.conf，增加一个相应的location配置：


```

location /data {
	default_type application/json;
	add_header Access-Control-Allow-Origin *;
	add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
	add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
	
	if ($request_method = 'OPTIONS') {
	    return 204;
	}
	
	# C:/project/data/DXY-COVID-19-Data-Arrange-DJSON就是下载的数据目录，请对应修改即可
	root   C:/project/data/DXY-COVID-19-Data-Arrange-DJSON;
	index  index.html index.htm;
}

```

这样配置后的数据地址是这样的：http://nginx绑定IP:nginx绑定端口/data

比如：http://127.0.0.1:80/data

### 3.3 [2003年中国SARS（非典）数据](https://zyq5945.github.io/zyq5945/blog_10.html)

#### github.io 网站：[https://zyq5945.github.io/SARS-Data-Arrange/china](https://zyq5945.github.io/diseasedataanalysis/overview.html?StartTime=2003/4/22&MinDay=-116&MaxDay=120&DaysOfTreatment=32&DataUrl=https://zyq5945.github.io/SARS-Data-Arrange/china)

#### github.com 仓库：https://raw.githubusercontent.com/zyq5945/SARS-Data-Arrange/master/china


注：数据计算的开始时间点是2003/4/22。

注：其中子区域的死亡数重新映射为医疗人员病例数，想要查看医疗人员感染情况请自行将关系对应好。


### 3.4 [WHO全球SARS（非典）总计数据](https://www.who.int/csr/sars/country/table2004_04_21/en/)

#### github.io 网站：[https://zyq5945.github.io/SARS-Data-Arrange/area](https://zyq5945.github.io/diseasedataanalysis/overview.html?DataUrl=https://zyq5945.github.io/SARS-Data-Arrange/area)

#### github.com 仓库：https://raw.githubusercontent.com/zyq5945/SARS-Data-Arrange/master/area


注：数据计算的开始时间点是2003-02-27。

注：该数据没有详情/对比/仿真页面数据。

## 4.页面说明

浏览器会对同时打开多个页面进行限制，请在浏览器设置界面搜索“弹出式窗口”进行相应设置。

### 4.1 总览页面overview.html

| 名称            | 类型  | 说明                               |
|---------------|-----|----------------------------------|
| 数据地址          | 字符串 | 要分析的疾病的数据仓库地址                    |
| 开始日期          | 日期  | 要分析的疾病的开始记录并计算的时间点               |
| 开始天数偏差        | 浮点型 | 要显示的数据开始时间偏差                     |
| 结束天数偏差        | 浮点型 | 要显示的数据结束时间偏差                     |
| 仿真治疗天数        | 浮点型 | 简单仿真疾病确诊后经过多少天治疗就产生结果，即要么康复，要么死亡 |
| 图形宽度          | 字符串 | 分析的图形要显示的宽度，可以是百分数或者带单位的像素宽度等    |
| 图形高度          | 整型  | 分析的图形要显示的像素高度                    |
| 加载数据          | 按钮  | 重新加载数据地址中的数据                     |
| 在本页下方显示数据     | 布尔型 | 手机用户可选择在页面下方进行数据显示               |
| 详 情           | 按钮  | 显示选择的多个省份或者市区的疾病数据详情             |
| 对 比           | 按钮  | 显示选择的多个省份或者市区的疾病数据对比             |
| 仿 真           | 按钮  | 显示选择的多个省份或者市区的疾病数据进行数据仿真         |
| 清除选择          | 按钮  | 清除选择的状态                          |
| 全选/全消/反选/选择按钮 | 按钮  | 控制各省份或者省份归属的数据显示和隐藏              |


### 4.2 详情/对比/仿真页面detail.html


| 名称            | 类型  | 说明                                |
|---------------|-----|-----------------------------------|
| 开始天数偏差        | 浮点型 | 要显示的数据开始时间偏差                      |
| 结束天数偏差        | 浮点型 | 要显示的数据结束时间偏差                      |
| 仿真康复A1        | 浮点型 | 仿真康复情况的Boltzmann模型的A1参数           |
| 仿真康复A2        | 浮点型 | 仿真康复情况的Boltzmann模型的A2参数           |
| 仿真康复x0        | 浮点型 | 仿真康复情况的Boltzmann模型的x0参数           |
| 仿真康复dx        | 浮点型 | 仿真康复情况的Boltzmann模型的dx参数           |
| 仿真死亡k         | 浮点型 | 仿真死亡情况的一次线型模型的k参数               |
| 仿真死亡b         | 浮点型  | 仿真死亡情况的一次线性模型的b参数               |
| 显 示\[Enter\]  | 按钮  | 修改参数后重新显示的按钮，快捷键是Enter |
| 清 空           | 按钮  | 清空所有的图像显示                         |
| 全选/全消/反选/选择按钮 | 按钮  | 控制各图像的显示和隐藏                       |


### 4.3 页面字段对应关系

请查看[DXY-COVID-19-Data-Arrange-DJSON](https://github.com/zyq5945/DXY-COVID-19-Data-Arrange-DJSON)的生成文件的说明。


## 5.一些个人的DXY-COVID-19数据分析心得


[《使用OriginLab的Boltzmann模型拟合仿真预测中国COVID-19(2019-nCov)疫情康复情况》](https://zyq5945.github.io/zyq5945/blog_13.html)

## 6.LICENSE

Based on [BSD](LICENSE) protocol.


