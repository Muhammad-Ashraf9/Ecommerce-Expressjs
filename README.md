**Shopifyer**
=============

Shopifyer is a secure e-commerce platform built using Node.js, Express, MongoDB and other packages.

**Features**
------------ 

### **User Authentication**

* User sign up and login functionality

* Passwords hashed using **bcrypt** package before storing for security 

* Sessions maintained using **express-session** package  

* CSRF protection using **csurf** package


### **Seller Accounts**

* Sellers can create account and list products  

* Dashboard to upload product images using **Multer** package

* Can manage order details and mark order statuses


### **Shop Functionalities**  

* **Homepage** displays featured products and categories

* **Product listing** page displays all products paginated  

* Users can view product details on **detail** page  

* **Shopping cart** to add products and quantities   

* **Checkout** process collects order details and processes payment

* Confirmation page displays order details  


### **Email Capabilities**   

* Password reset workflow using **Nodemailer** package  

* Email notifications on order status changes


### **PDF Invoices**  

* Downloadable **PDF invoices** generated with **pdfkit** package 


### **Input Validation**

* Express middleware **express-validator** used for validation on frontend inputs

* Proper error messaging displayed  


### **Error Handling**   

* Custom middleware used for catching errors

* Friendly error messages shown on screen 


### **Database**   

* **MongoDB** object database used with **mongoose** ODM package  

* Relations between products, users, orders etc


**Templating & Rendering**
--------------------------   

**EJS** used as the templating engine to render UI components  

### **Packages Used**  

* **ejs**: Templating   

* **express**: Web framework  

* **mongoose**: MongoDB ODM  

* **bcrypt**: Password hashing   

* **multer**: File upload  

* **pdfkit**: PDF generation    

* **nodemailer**: Email sending  

* **express-validator**: Validation 

* **csurf**: CSRF protection
