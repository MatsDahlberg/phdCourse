import tornado.template as template
import tornado.gen
import torndb as database
import json
import logging
import ast
import datetime
import time
import applicationTemplate
import os, random, string
import csv
import re
import util
import secrets

db = database.Connection('127.0.0.1',
                         'phd_course',
                         user=secrets.mysqlUser,
                         password=secrets.mysqlPwd)

class home(util.UnsafeHandler):
    def get(self, *args, **kwargs):
        self.set_header('Access-Control-Allow-Origin', '*')
        t = template.Template(applicationTemplate.indexHead)
        self.write(t.generate())
        if self.get_current_user() != None:
            t = template.Template(applicationTemplate.indexHtml)
        else:
            t = template.Template(applicationTemplate.notAuthorizedHtml)
        logging.info(self.get_current_user())
        self.write(t.generate(user_name=self.get_current_user()))

class updateCourse(util.SafeHandler):
    def post(self, *args, **kwargs):
        self.set_header("Content-Type", "application/json")
        try:
            sEmail = self.get_argument("email", strip=False)
            sPk = self.get_argument("pk", strip=False)
            sCourseName = self.get_argument("course_name", strip=False)
            sSubject = self.get_argument("subject", strip=False)
            sPoints = self.get_argument("points", strip=False)
            sDateStart = self.get_argument("date_start", strip=False)
            sDateEnd = self.get_argument("date_end", strip=False)
            sLastApplyDate = self.get_argument("last_apply_date", strip=False)
            sCourseVelocity = self.get_argument("course_velocity", strip=False)
            sUniversity = self.get_argument("university", strip=False)
            sCourseUrl = self.get_argument("course_url", strip=False)
            sDistanceCourse = self.get_argument("distance_course", strip=False)
            sLangage = self.get_argument("language", strip=False)
        except:
            logging.error("Error in argument list, updateCourse")
            return
        if sEmail != self.get_secure_cookie("email"):
            logging.error("Course owner notsame user as logged user")
            return

        try:
            sSlask = time.strptime(sDateStart, "%Y-%m-%d")
            sSlask = time.strptime(sDateEnd, "%Y-%m-%d")
            sSlask = time.strptime(sLastApplyDate, "%Y-%m-%d")
        except:
            self.set_status(400)
            self.finish({"Error":"Wrong date format"})
            logging.error("Error, wrong date format")
            return

        sSql = """update phd_course.course set
                  course_name=%s,
                  subject=%s,
                  points=%s,
                  date_start=%s,
                  date_end=%s,
                  last_apply_date=%s,
                  course_velocity=%s,
                  university=%s,
                  course_url=%s,
                  distance_course=%s,
                  language=%s
                  where pk=%s
               """
        if sPoints == "":
            sPoints = None
        if sCourseVelocity == "":
            sCourseVelocity = None
        db.update(sSql, sCourseName, sSubject, sPoints, sDateStart, sDateEnd, sLastApplyDate,
                  sCourseVelocity, sUniversity, sCourseUrl, sDistanceCourse, sLangage, sPk)

class createCourse(util.SafeHandler):
    def post(self, *args, **kwargs):
        tRes = db.query("""select pk from phd_course.administrators where email='%s'"""
                        %(self.get_secure_cookie("email")))
        sSql = """insert into phd_course.course (date_start, date_end, last_apply_date, last_edit_by, added_by)
                  values ('2011-01-01', '2011-01-01', '2011-01-01', %s, %s)
               """
        db.insert(sSql, tRes[0].pk, tRes[0].pk)
        self.redirect("/getUserCourses")
        print "Create new course"

class getUserCourses(util.SafeHandler):
    def get(self, *args, **kwargs):
        sEmail = self.get_secure_cookie("email")
        self.set_header("Content-Type", "application/json")
        tRes = db.query("""SELECT c.pk, course_name, subject, points, date_start, date_end, last_apply_date,
                           course_velocity, c.university, course_url, distance_course, language
                           from phd_course.course c, phd_course.administrators a
                           where c.added_by = a.pk and email='%s' order by c.pk""" % (sEmail))
        def makeJson(tData):
            jRes = list()
            for row in tData:
                jRes.append({"email":sEmail,
                             "pk":row.pk,
                             "course_name":row.course_name,
                             "subject": row.subject,
                             "points": row.points,
                             "date_start": str(row.date_start),
                             "date_end": str(row.date_end),
                             "last_apply_date": str(row.last_apply_date),
                             "course_velocity": row.course_velocity,
                             "university": row.university,
                             "course_url": row.course_url,
                             "distance_course": row.distance_course,
                             "language": row.language
                             })
            return jRes
        jRes = makeJson(tRes)
        self.write(json.dumps(jRes, indent=4))

class getCourses(util.UnsafeHandler):
    def get(self, *args, **kwargs):
        self.set_header("Content-Type", "application/json")
        tRes = db.query("""SELECT pk, course_name, subject, points, date_start, date_end, last_apply_date,
                           course_velocity, university, course_url, distance_course, language
                           from phd_course.course where last_apply_date > now()
                           order by pk""")
        def makeJson(tData):
            jRes = list()
            for row in tData:
                jRes.append({"pk":row.pk,
                             "course_name":row.course_name,
                             "subject": row.subject,
                             "points": row.points,
                             "date_start": str(row.date_start),
                             "date_end": str(row.date_end),
                             "last_apply_date": str(row.last_apply_date),
                             "course_velocity": row.course_velocity,
                             "university": row.university,
                             "course_url": row.course_url,
                             "distance_course": row.distance_course,
                             "language": row.language
                             })
            return jRes
        jRes = makeJson(tRes)
        self.write(json.dumps(jRes, indent=4))

class getSubjects(util.UnsafeHandler):
    def get(self, *args, **kwargs):
        tRes = db.query("""SELECT pk as id, subject_name as subject
                           from phd_course.subjects
                           order by pk""")
        self.write(json.dumps(tRes, indent=4))

class StaticFileHandler(tornado.web.StaticFileHandler):
    def get(self, path, include_body=True):
        if path.endswith('woff'):
            self.set_header('Content-Type','application/font-woff')
        super(StaticFileHandler, self).get(path, include_body)
