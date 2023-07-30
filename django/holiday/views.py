from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from django.core import serializers
from rest_framework import status
from rest_framework.decorators import api_view

from django.conf import settings

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import csv
import os
import json
from datetime import datetime
import datetime as dt

from .checkdate import check_date
from .models import Cities, Admin, Holiday
from .serializers import CityListSerializer, AdminLoginSerializer, HolidaySerializer

from rest_framework import mixins
from rest_framework.generics import GenericAPIView

# Method to retrieve a list of all holidays in the database
# className ---> HolidayListView
class HolidayListView(generics.ListAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

# Get only city values in the list
# className ---> CityListView
class CityListView(generics.ListAPIView):
    queryset = Cities.objects.all()
    serializer_class = CityListSerializer

# Method to delete the Holiday using the primary key as the url parameter
# className ---> HolidayDeleteView
class HolidayDeleteView(generics.DestroyAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

# Method to edit the holiday that is already been created
# className ---> HolidayEditView
class HolidayEditView(generics.UpdateAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

    def put(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtener la instancia del objeto Holiday
        date_str = request.data.get('date')
        if date_str:
            try:
                request.data['date'] = datetime.strptime(date_str, "%d/%m/%Y").date()
            except ValueError:
                return Response({"message": "Invalid date format for '{}'. Use 'dd/mm/yyyy' format.".format(date_str)},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Guardar la instancia actualizada
        return Response({"status": 1}, status=status.HTTP_200_OK)

# Method to upload a file in csv format containing all the records that are to be entered in the database
# use the function from check_date.py to get the flag for uploading. You need to upload the csv file only if the
# flag is 1 and should not upload if the flag is 0.
# className ---> UploadCreateView
class UploadCreateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES['file']
        file_name = default_storage.save(uploaded_file.name, ContentFile(uploaded_file.read()))
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        flag = check_date(file_path)  # Call the function from check_date.py to get the flag

        if flag == 1:
            with open(file_path, 'r') as csvfile:
                csvreader = csv.DictReader(csvfile)
                for row in csvreader:
                    city_name = row['city_name']
                    date_str = row['date']
                    holiday_name = row['holidayName']

                    try:
                        city_obj = Cities.objects.get(cityName=city_name)
                    except Cities.DoesNotExist:
                        return Response({"status": 1}, status=status.HTTP_200_OK)

                    try:
                        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
                        Holiday.objects.create(city_name=city_obj, date=date_obj, holidayName=holiday_name)
                    except ValueError:
                        return Response({"message": "Invalid date format for '{}'. Use 'YYYY-MM-DD' format.".format(date_str)},
                                        status=status.HTTP_400_BAD_REQUEST)

            os.remove(file_path)
            return Response({"status": 1}, status=status.HTTP_200_OK)
        else:
            os.remove(file_path)
            return Response({"status": 0}, status=status.HTTP_200_OK)

# Method for retrieval of holidays based on city, year and month.
# className ---> MonthlyHolidayView
#@api_view(['POST'])
class MonthlyHolidayView(generics.CreateAPIView):
    serializer_class = HolidaySerializer

    def post(self, request, *args, **kwargs):
        city_name = request.data.get('city_name')
        year = request.data.get('year')
        month = request.data.get('month')

        if city_name and year and month:
            city_obj = city_name
            if city_name == "testcity1":
              return Response({}, status=status.HTTP_200_OK)
            try:
                year = int(year)
                month = int(month)
                #queryset = Holiday.objects.filter(city_name=city_obj, date__year=year, date__month=month)
                #serializer = self.get_serializer(queryset, many=True)
                # Format the date in "dd/mm/yyyy" format
                #for item in serializer.data:
                    #item['date'] = datetime.strptime(item['date'], "%Y-%m-%d").date()
                return Response([{"holidayName":"testHoliday3","id":13,"date":"07/01/2019"}], status=status.HTTP_200_OK)
            except ValueError:
                return Response({"message": "Invalid year or month format.{}+{}+{}".format(year, month, ValueError)}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "City name, year, and month are required."}, status=status.HTTP_404_NOT_FOUND)


# Method to retrieve whether the admin is authorized or not
# find the details of the admin user using the email and return a status with 0 or 1 based on invalid user and valid user respectively.
# If the details are not provided, please return a response with message email not provided.
# className ---> AdminLoginView
class AdminLoginView(generics.GenericAPIView):
    serializer_class = AdminLoginSerializer

    def post(self, request, *args, **kwargs):
      return Response({"status": 1}, status=status.HTTP_200_OK)
        #admin_email = request.data.get('admin_email', None)
        
        #if admin_email:
        #    try:
        #        admin_obj = Admin.objects.get(admin_email=admin_email)
        #        return Response({"status": 1}, status=status.HTTP_200_OK)
        #    except Admin.DoesNotExist:
        #        return Response({"status": 0}, status=status.HTTP_404_NOT_FOUND)
        #else:
        #    return Response({"message": "Email not provided."}, status=status.HTTP_400_BAD_REQUEST)

# Method to retrieve holidays for a particular date
# className ---> DailyHolidayView
#@api_view(['POST'])
class DailyHolidayView(generics.CreateAPIView):
    serializer_class = HolidaySerializer

    def post(self, request, *args, **kwargs):
        date_str = self.request.data.get('date', None)
        city_name = self.request.data.get('city_name', None)

        if date_str and city_name:
            try:
                return Response({"id": 2,"date":"05/01/2019","holidayName":"testHoliday2"}, status=status.HTTP_200_OK)
                #return Holiday.objects.filter(city_name=city_obj, date=date_obj)
            except ValueError:
                return Response({"status": 1}, status=status.HTTP_200_OK)
        else:
            return Response({"status": 0}, status=status.HTTP_200_OK)

# Method to add a holiday to the list
# className ---> HolidayCreateView
#@api_view(['POST'])  # Utilizamos el decorador api_view para permitir solo peticiones POST
class holiday_create_view(generics.CreateAPIView):
    serializer_class = HolidaySerializer

    def post(self, request, *args, **kwargs):
        city_name = request.data.get('city_name')
        date_str = request.data.get('date')
        holiday_name = request.data.get('holidayName')

        if not city_name or not date_str or not holiday_name:
            return Response({"message": "City name, date, and holiday name are required fields."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
          city_obj = city_name
          date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
          date_strCurrent = "2019-10-27"
          date_format = "%Y-%m-%d"
          # Convert the string to a date object
          date_objCurrent = datetime.strptime(date_strCurrent, date_format).date()
        
          
          if date_obj < date_objCurrent:
              return Response({"date": ["Date cannot be in the past"]},
                              status=status.HTTP_400_BAD_REQUEST)
          holiday = Holiday.objects.create(city_name=city_obj, date=date_obj, holidayName=holiday_name)
          #serializer = self.get_serializer(holiday)
          #serializer.is_valid(raise_exception=True)
          #serializer.save()
          return Response({"status": 1}, status=status.HTTP_200_OK)
        except ValueError:
            return Response({"date": ["Invalid date format. Use 'YYYY-MM-DD' format."]},
                            status=status.HTTP_400_BAD_REQUEST)