read -p $'\nCreate user'
curl -X "POST" "http://localhost:3000/signup" \
-H "Content-Type: application/json; charset=utf-8" \
-d $'{
"username": "blabla",
"email": "bla@mail.com",
"password": "123456"
}'

read -p $'\nLog in'
curl -X "POST" "http://localhost:3000/login" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "username": "blabla",
  "password": "123456"
}'

read -p $'\nUpdate user'
curl -X "PUT" "http://localhost:3000/users/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "email": "bla@hotmail.com"
}'

read -p $'\nUpdate password'
curl -X "PUT" "http://localhost:3000/users/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "password": "456789"
}'

read -p $'\nGet courses'
curl "http://localhost:3000/save" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nGet search results'
curl "http://localhost:3000/search" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nGet courselist'
curl "http://localhost:3000/courseslist" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nDelete user'
curl -X "DELETE" "http://localhost:3000/user/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'
