import webapp2
import jinja2
import urllib2
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

class EventsHandler(webapp2.RequestHandler):
    def get(self):
        destination = self.request.get("destination")
        filters = self.request.get("filter")
        radius = self.request.get("radius")

        dict = {
            'city': destination,
            'filter': filters,
            'radius': radius,
        }

        events_template = the_jinja_env.get_template("template/events.html")
        self.response.write(events_template.render(dict))

    def post(self):
        destination = self.request.get("destination")
        filters = self.request.get("filter")
        radius = self.request.get("radius")
        filter = Filters(destination = destination, filter = filters, radius = float(radius))
        print filter
        print filter.put()

        events_template = the_jinja_env.get_template("template/events.html")
        dict = {
            'city': destination,
            'filter': filters,
            'radius': radius,
        }
        self.response.write(events_template.render(dict))

class CalendarHandler(webapp2.RequestHandler):
    def get(self):
        calendar_template = the_jinja_env.get_template("template/calendar.html")
        self.response.write(calendar_template.render())

class MapHandler(webapp2.RequestHandler):
    def get(self):
        map_template = the_jinja_env.get_template("template/map.html")
        self.response.write(map_template.render())

class ApiHandler(webapp2.RequestHandler):
    def get(self):
        res = ""
        url = 'https://www.eventbriteapi.com/v3/events/search?categories=103&location.address="' + (self.request.get("address")).replace(" ","")+'"&location.within='+ self.request.get('radius') +'km&expand=venue&token=OUVFOFRWDHQHSAPTJX5O'
        req = urllib2.Request(url, {}, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        for x in f:
            res += x
        f.close()
        self.response.write(res)

class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        logout_url= users.create_logout_url("/")
        user = users.get_current_user()
        self.redirect(logout_url)
    def post(self):
        pass

app = webapp2.WSGIApplication([
    ("/", MainHandler),
    ("/login", LoginHandler),
    ("/usermanagement", UserManagementHandler),
    ("/events",EventsHandler),
    ("/calendar", CalendarHandler),
    ("/map", MapHandler),
    ("/api", ApiHandler),
    ("/logout", LogoutHandler),
], debug=True)
