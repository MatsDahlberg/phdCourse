indexHead="""
<!DOCTYPE html>

<!-- define angular app -->
<html ng-app="App">

<head>
  <!-- SCROLLS -->
  <meta charset="utf-8">

  <!-- Bootstrap -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

  <!-- Angular -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.js"></script>

  <!-- Angular grid gui -->
    <script src="/javascript/ui-grid/pdfmake.js"></script>
    <script src="/javascript/ui-grid/vfs_fonts.js"></script>
    <script src="/javascript/ui-grid/ui-grid.js"></script>
    <link rel="stylesheet" href="/javascript/ui-grid/ui-grid.css" type="text/css">
    <link rel="stylesheet" href="/javascript/main.css" type="text/css">
    <link rel="stylesheet" href="/javascript/local.css" type="text/css">

  <!-- The application -->
  <script src="javascript/app.js"></script>
</head>
"""
indexHtml="""
<!-- define angular controller -->
<body ng-controller="mainController as mainCtrl">

  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="/#/">PhD Courses</a>
      </div>

      <ul class="nav navbar-nav navbar-right">
           <a href="/#/" role="button" class="btn btn-default">View courses</a>
           <a href="/#/editCourses/" role="button" class="btn btn-default">Edit courses</a>
<!--
-->
           <a href="/#/editSubjects" role="button" class="btn btn-default">Edit subjects</a>
           &nbsp;
           &nbsp;
           <div class="btn-group navbar-btn">
              {%if user_name != None%}
                {{user_name}}<br>
                <a href="/logout">Logout</a>
              {% else %}
                <br>
                <a href="/login">Login</a>
              {% end %}
           </div>
      </ul>
    </div>
  </nav>

  <div id="main">
    <!-- angular templating -->
		<!-- this is where content will be injected by angular-->
    <div ng-view></div>
  </div>
  
  <footer class="text-center">
  </footer>
  
</body>
</html>
"""
notAuthorizedHtml="""
<!-- define angular controller -->

<body ng-controller="mainController as mainCtrl">
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="/#/">PhD Courses</a>
      </div>
      <ul class="nav navbar-nav navbar-right">
           <div class="btn-group navbar-btn">
                <br>
                <a href="/login">Login</a>
           </div>
      </ul>
    </div>
  </nav>
  <div id="main">
    <!-- angular templating -->
		<!-- this is where content will be injected -->
    <div ng-view></div>
  </div>

</body>
</html>
"""
