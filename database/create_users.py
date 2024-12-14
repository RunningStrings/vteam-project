from faker import Faker
import random

fake=Faker()

def get_first_name():
    return fake.first_name()

def  get_last_name():
	return  fake.last_name()

def  get_phone_number():
	return  fake.phone_number()

def  get_email_adress(first_name, last_name):
	separators = [".","-","_"]
	return first_name[0] + separators[random.randint(0, len(separators) - 1)] + last_name + str(random.randint(50,99)) + "@gmail.com"
    

def  get_balance():
	return  random.randint(0,1000)

def  generate_user():
	first_name = get_first_name()
	last_name = get_last_name()
	return [first_name, last_name,
		get_phone_number(),
		get_email_adress(first_name, last_name),
		get_balance()]

string=[]
for x in range(250): 
    string.append(generate_user())
print (string)