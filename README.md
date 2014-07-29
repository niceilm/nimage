# 로컬 개발 환경 세팅

## 사전 설치 프로그램 - OSX 기준
```
brew install mysql
brew install nginx
brew install imagemagick
brew tap homebrew/science
brew install opencv
npm install -g supervisor
```
### mysql
```
mysql -uroot;
create database image;
```

## 소스체크아웃 및 디펜던시 다운로드
```
git clone 
cd nimage
npm install
```

## 개발환경
```
//  DB 초기화 할때만 사용(주의! 데이터베이스 내용 초기화됨)
DBSYNC=true supervisor -i public/ app.js
supervisor -i public/ app.js
```

## nginx
```
server {
listen 80;
        charset utf-8;
        server_name local.i.niceilm.net;
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://127.0.0.1:3007;
                proxy_redirect off;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```

# API
## upload by file
### POST http://i.niceilm.net/up
```
// multipart
// 단건
// parameters
name=file

// returns
[{url:"http://i.niceilm.net/dn/:hashedId", width:300, height:200, size:3000, type:'jpeg'}]

// 여러건
// parameters
name=file
name=file

// returns
[{"url":"http://i.niceilm.net/dn/RAma6DleAlw9PGB2","width":647,"height":1145,"size":128354,"type":"image/png","hashedId":"RAma6DleAlw9PGB2"},{"url":"http://i.niceilm.net/dn/pqmvQDbOByoVE0M2","width":645,"height":1144,"size":573061,"type":"image/png","hashedId":"pqmvQDbOByoVE0M2"}]

```

## upload by url
### POST http://i.niceilm.net/up/url
```
// 단건
// parameters
{url:""}

// returns
[{url:"http://i.niceilm.net/dn/:hashedId", width:300, height:200, size:3000, type:'jpeg'}]

// 복수개
// parameters
{"url":["http://dimg.donga.com/wps/SPORTS/IMAGE/2010/05/19/24690964.4.jpg", "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS-DF9b7N3TG5dEZKjW7UUValVA1wV5c5dz_FK67cjz4w6G-55dVw"]}

// returns
[{"url":"http://i.niceilm.net/dn/Vgn3QYRleDvrZq4k","width":398,"height":499,"size":93682,"type":"image/jpeg","hashedId":"Vgn3QYRleDvrZq4k"},{"url":"http://i.niceilm.net/dn/OXMkrNBmXDgJ7m8l","width":284,"height":177,"size":8317,"type":"image/jpeg","hashedId":"OXMkrNBmXDgJ7m8l"}]
```

## crop
### POST http://i.niceilm.net/up/crop
```
// parameters
{width:0, height:0, x:0, y:0, url:""}

// returns
{url:"http://i.niceilm.net/dn/:hashedId", width:300, height:200, size:3000, type:'jpeg'}
```

## download / thumbnail
### GET http://i.niceilm.net/dn/:hashedId?type=:type&width=:width&height=:height
```
// returns
image file
```

### example

#### 원본이미지
http://i.niceilm.net/dn/Pq7r0ny2M3KopjdL

#### 가로 200 기준 썸네일
http://i.niceilm.net/dn/Pq7r0ny2M3KopjdL?width=200

#### 가로 200 세로 300 자동 얼굴 크롭 썸네일
http://i.niceilm.net/dn/Pq7r0ny2M3KopjdL?width=200&height=300

# Test
## jasmine-node 설치
```
sudo npm install jasmine-node@1.14.2 -g
```

## testing
```
jasmine-node test/
```

# TODO
- API KEY 방식으로 변경(업로드시에만 API KEY 체크)
- 로그인 기반 변경(페이스북/이메일기반)
- 앱생성/삭제
- http://i.niceilm.net/dn/someappname/:hashId?type=:type&width=:width&height=:height
