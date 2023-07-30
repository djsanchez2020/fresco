from rest_framework import serializers
from .models import Holiday, Cities, Admin

# Holiday serializer with id, cityname, date, and holidayname
# Name ----> HolidaySerializer
class HolidaySerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d/%m/%Y')

    class Meta:
        model = Holiday
        fields = ['city_name', 'date', 'holidayName']

# HolidayList serializer with cityname, date, and holidayname
# Name -----> HolidayListSerializer
class HolidayListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d/%m/%Y')

    class Meta:
        model = Holiday
        fields = ['city_name', 'date', 'holidayName']

# Upload serializer with a field --> file which is not present in the holiday model
# Name ----> UploadSerializer
class UploadSerializer(serializers.Serializer):
    file = serializers.FileField()

# CityList serializer with cityname
# Name -----> CityListSerializer
class CityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cities
        fields = ['cityName']

# Month serializer with fields cityname and year, month which are not present in the model
# Name -----> MonthSerializer
class MonthSerializer(serializers.Serializer):
    city_name = serializers.CharField(max_length=100)
    year = serializers.IntegerField()
    month = serializers.IntegerField()

# Daily serializer with date field
# Name -----> DailySerializer
class DailySerializer(serializers.Serializer):
    date = serializers.DateField(format='%d/%m/%Y')

# AdminLogin serializer with adminemail and password
# Name -----> AdminLoginSerializer
class AdminLoginSerializer(serializers.Serializer):
    admin_email = serializers.EmailField()
    password = serializers.CharField()
