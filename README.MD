
# TASK APPLICATION

welcome to task application, this application shows you the principles of Vue and Laravel.

The application shows a list of orders and products, the user can see the order list, check a order detail, modify an order and delete it, and can also check the list of products (just showing the product list)




## Installation

to run this project you need some tools:

- [Docker](https://www.docker.com/)
- [Visual Studio Code ](https://code.visualstudio.com/) or another IDE

now with docker running:
```bash
  git clone https://github.com/gregoriosiravo/test.github
  cd backend
  cp .env.example .env
  cd ..
  docker-compose up -d
  docker exec -it laravel-app php artisan key:generate
  docker exec -it laravel-app php artisan migrate:fresh --seed
```
with those commands your application is ready. 

The front-end will be showed at [http://localhost:3000](http://localhost:3000) and the back-end will listen at [http://localhost:8000](http://localhost:8000)

for more information check the [documentation]()
## Test
To run unit test you should run this command and it will run all the unit test for the front-end

```bash
docker exec -it vue-app npm run test:unit
```


## Documentation

for detailed informations please check the documentation:

[Documentation](https://www.notion.so/ILIAD-TEST-DOCUMENTATION-24e4c19364cf807d8d01d089c837c482?source=copy_link)

## Author

- [@gregoriosiravo](https://www.github.com/gregoriosiravo)

