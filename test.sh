sudo apt-get update -y;
sudo apt-get install -y bc;
cd angular;
npm test;
cd ..;
cd django;
rm -rf unit.xml; 
python3 manage.py makemigrations;
python3 manage.py migrate --run-syncdb;
python3 manage.py test --keepdb;
cd ..;
if [ -e angular/unit.xml ]; then
        tests_count1=$(cat angular/unit.xml | grep -oE 'tests\="[0-9]{1,3}"' | grep -oE '[0-9]{1,3}');    
        errors_count1=$(cat angular/unit.xml | grep -oE 'errors\="[0-9]{1,3}"' | grep -oE '[0-9]{1,3}');    
        failure_count1=$(cat angular/unit.xml | grep -oE 'failures\="[0-9]{1,3}"' | grep -oE '[0-9]{1,3}');    
        totalFailure1=$(( $errors_count1 + $failure_count1 ));    
        totalScore1=$(( $tests_count1 - $totalFailure1 ));    
        totalPercent1=$(printf %.$2f $(echo "$totalScore1/$tests_count1*80" | bc -l));    
else    
        echo "angular/unit.xml is not generated";    
        totalPercent1=0;
fi;

if [ -e django/unit.xml ]; then
        tests_count2=$(cat django/unit.xml | grep -oE 'tests\="[0-9]{1,2}"' | grep -oE '[0-9]{1,2}');    
        errors_count2=$(cat django/unit.xml | grep -oE 'errors\="[0-9]{1,2}"' | grep -oE '[0-9]{1,2}');    
        failure_count2=$(cat django/unit.xml | grep -oE 'failures\="[0-9]{1,2}"' | grep -oE '[0-9]{1,2}');    
        totalFailure2=$(( $errors_count2 + $failure_count2 ));    
        totalScore2=$(( $tests_count2 - $totalFailure2 ));    
        totalPercent2=$(printf %.$2f $(echo "$totalScore2/$tests_count2*20" | bc -l));    
else    
        echo "django/unit.xml is not generated";    
        totalPercent2=0;
fi;

totalPercent=$(( $totalPercent1+$totalPercent2 ));
echo "FS_SCORE:$totalPercent%"
