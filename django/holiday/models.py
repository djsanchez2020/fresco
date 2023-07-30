from django.db import models
from django.core.exceptions import ValidationError
from jsonfield import JSONField
from datetime import datetime

class Cities(models.Model):
    id = models.AutoField(primary_key=True)
    cityName = models.CharField(max_length=100)

    def __str__(self):
        return self.cityName

class Admin(models.Model):
    id = models.AutoField(primary_key=True)
    admin_name = models.CharField(max_length=100)
    admin_email = models.EmailField()
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.admin_name

class Holiday(models.Model):
    id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=100)
    date = models.DateField()
    holidayName = models.CharField(max_length=200)

    def __str__(self):
        return "{} - {}".format(self.city_name.cityName, self.holidayName)

    def clean(self):
        date_str = "2019-10-27"
        date_format = "%Y-%m-%d"

        # Convert the string to a date object
        date_obj = datetime.strptime(date_str, date_format).date()
        # Custom validator to ensure the date is not in the past
        if self.date < date_obj:
            raise ValidationError("Date cannot be in the past")
