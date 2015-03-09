Database application for handling PhD courses.

Uses mysql, [tornado](http://www.tornadoweb.org/en/stable/), [bootstrap](http://getbootstrap.com/), [angularjs](https://angularjs.org/) and [angular-ui/ng-grid](http://ui-grid.info/)

Login is done through google_oauth. 

4 variable values should be present in a file named ```secrets.py```:
```
googleKey = 
googleSecret = 
mysqlUser = 
mysqlPwd =
```

In the directory ```cert``` there should be 2 files:
```
myserver.key 
server.crt
```

To start the application:
```
python route.py
```


The tornado-server offers the following services:
```
--Public services
/getSubjects
/getCourses
```

```
--Services that require authentification
/getUsersCourses
/updateCourse
/createCourse
```

```
--Utility services
/login
/logout
```
