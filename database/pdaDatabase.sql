BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "payment" (
	"id"	INTEGER NOT NULL,
	"datetime"	datetime NOT NULL,
	"amountPaid"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "table" (
	"name"	TEXT NOT NULL,
	"locationInStore"	TEXT NOT NULL,
	PRIMARY KEY("name","locationInStore")
);
CREATE TABLE IF NOT EXISTS "worker" (
	"username"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"isAdmin"	boolean NOT NULL DEFAULT 0,
	"totalHoursLogged"	INTEGER,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("username")
);
CREATE TABLE IF NOT EXISTS "customer" (
	"email"	INTEGER NOT NULL,
	"timesVisited"	INTEGER DEFAULT 1,
	PRIMARY KEY("email")
);
CREATE TABLE IF NOT EXISTS "worksAs" (
	"workerUsername"	TEXT NOT NULL,
	"posName"	TEXT NOT NULL,
	"shiftStart"	datetime,
	"shiftEnd"	datetime,
	PRIMARY KEY("workerUsername","posName")
);
CREATE TABLE IF NOT EXISTS "menuItem" (
	"id"	INTEGER NOT NULL,
	"size"	TEXT,
	"category"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"description"	TEXT,
	"producedByPosition"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "order" (
	"orderId"	INTEGER NOT NULL,
	"totalOrderCost"	float NOT NULL,
	"timeExecuted"	dateTime NOT NULL,
	"isCustomerOder"	boolean,
	"tableName"	TEXT,
	FOREIGN KEY("tableName") REFERENCES "table"("name") ON UPDATE CASCADE,
	PRIMARY KEY("orderId")
);
CREATE TABLE IF NOT EXISTS "pays" (
	"customerEmail"	TEXT DEFAULT 0,
	"orderId"	INTEGER NOT NULL,
	"payId"	INTEGER NOT NULL,
	FOREIGN KEY("customerEmail") REFERENCES "customer"("email") ON UPDATE CASCADE,
	FOREIGN KEY("orderId") REFERENCES "order"("orderId") ON UPDATE CASCADE,
	FOREIGN KEY("payId") REFERENCES "payment"("id") ON UPDATE CASCADE,
	PRIMARY KEY("customerEmail","orderId","payId")
);
CREATE TABLE IF NOT EXISTS "editsORcreates" (
	"customerEmail"	TEXT DEFAULT 0,
	"orderId"	INTEGER NOT NULL,
	"menuItemId"	INTEGER NOT NULL,
	"workerUsername"	INTEGER DEFAULT 0,
	"comment"	TEXT,
	"isOnTheHouse"	boolean,
	FOREIGN KEY("customerEmail") REFERENCES "customer"("email") ON UPDATE CASCADE,
	FOREIGN KEY("orderId") REFERENCES "order"("orderId") ON UPDATE CASCADE,
	FOREIGN KEY("menuItemId") REFERENCES "menuItem"("id") ON UPDATE CASCADE,
	FOREIGN KEY("workerUsername") REFERENCES "worker"("username") ON UPDATE CASCADE,
	PRIMARY KEY("workerUsername","menuItemId","orderId","customerEmail")
);
CREATE TABLE IF NOT EXISTS "position" (
	"name"	INTEGER NOT NULL,
	PRIMARY KEY("name")
);
COMMIT;
