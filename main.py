import webapp2
import jinja2
import os
import json
from google.appengine.api import users
from google.appengine.ext import ndb



the_jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class Filters(ndb.Model):
    destination = ndb.StringProperty (required =True)
    filter = ndb.StringProperty (required = True)
    radius = ndb.FloatProperty (required = True)

class 


class MainHandler(webapp2.RequestHandler):
    def get(self):
        user= users.get_current_user()
        if user:
            nickname=  user.nickname()
        else:
            nickname = "user"

        main_template = the_jinja_env.get_template("template/main.html")
        self.response.write(main_template.render({
        "nickname":  nickname.upper()
        }))
class LoginHandler(webapp2.RequestHandler):
    def get(self):
        login_url= users.create_login_url("/")
        user = users.get_current_user()
        self.redirect(login_url)
    def post(self):
        pass

class UserManagementHandler(webapp2.RequestHandler):
    def get(self):
        user_template = the_jinja_env.get_template("template/user.html")
        self.response.write(user_template.render())


    def post(self):
        pass

class EventsHandler(webapp2.RequestHandler):
    def get(self):
        events_template = the_jinja_env.get_template("template/events.html")
        self.response.write(events_template.render())

    def post(self):
        destination = self.request.get("destination")
        filter = self.request.get("filter")
        radius = self.request.get("radius")
        filter= Filters(destination = destination, filter = filter, radius = float(radius))
        print filter
        print filter.put()


class CalendarHandler(webapp2.RequestHandler):
    def get(self):
        calendar_template = the_jinja_env.get_template("template/calendar.html")
        self.response.write(calendar_template.render())

class MapHandler(webapp2.RequestHandler):
    def get(self):
        map_template = the_jinja_env.get_template("template/map.html")
        self.response.write(map_template.render())


# class Destination(ndb.Model):
#     destination = ndb.StringProperty (required = true)
#
# class Filter(ndb.Model):
#     filter = ndb.StringProperty (required = true)
#
# class Radius (ndb.Model):
#     radius =ndb.FloatProperty (required = true)



app = webapp2.WSGIApplication([
    ("/", MainHandler),
    ("/login", LoginHandler),
    ("/usermanagement", UserManagementHandler),
    ("/events",EventsHandler),
    ("/calendar", CalendarHandler),
    ("/map", MapHandler),
], debug=True)
