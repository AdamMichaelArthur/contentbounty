#!/bin/bash
echo Please Type The New Components Name
read name
ng g c $name

mkdir src/app/_components/$name
mv src/app/$name src/app_components

