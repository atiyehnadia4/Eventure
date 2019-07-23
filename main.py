import webapp2
import jinja2
import os
import json
from google.appengine.api import users
# from google.appengine.api import ndb


the_jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        main_template = the_jinja_env.get_template("template/main.html")
        self.response.write(main_template.render())

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        login_template = the_jinja_env.get_template("template/login.html")
        self.response.write(login_template.render())
    def post(self):
        pass

class UserManagementHandler(webapp2.RequestHandler):
    def get(self):
        user_template = the_jinja_env.get_template("template/user.html")
        self.response.write(user_template.render())
    def post(self):
        pass


class ParameterHandler(webapp2.RequestHandler):
    def get(self):
        parameter_template = the_jinja_env.get_template("template/parameters.html")
        self.response.write(parameter_template.render())

class EventsHandler(webapp2.RequestHandler):
    def get(self):
        events_template = the_jinja_env.get_template("template/events.html")
        self.response.write(events_template.render())

class CalendarHandler(webapp2.RequestHandler):
    def get(self):
        calendar_template = the_jinja_env.get_template("template/calendar.html")
        self.response.write(calendar_template.render())

class MapHandler(webapp2.RequestHandler):
    def get(self):
        map_template = the_jinja_env.get_template("template/map.html")
        self.response.write(map_template.render())


app = webapp2.WSGIApplication([
    ("/", MainHandler),
    ("/login", LoginHandler),
    ("/usermanagement", UserManagementHandler),
    ("/parameters", ParameterHandler),
    ("/events",EventsHandler),
    ("/calendar", CalendarHandler),
    ("/map", MapHandler),
], debug=True)
