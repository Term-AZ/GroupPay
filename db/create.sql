use gp_db;

CREATE TABLE gp_db.Users(
	User_Id INT auto_increment NOT NULL,
	User_Name varchar(100) NOT NULL,
	Email varchar(100) NOT NULL,
	User_Password varchar(100) NOT NULL,
	Date_Joined DATE NOT NULL,
	PRIMARY KEY (User_Id)
);

CREATE TABLE gp_db.Groups_Users(
	Id INT auto_increment NOT NULL,
	User_Id INT NOT NULL,
	Group_Id INT NOT NULL,
	Date_Joined Date NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (User_Id) REFERENCES gp_db.Users(User_Id) ON DELETE CASCADE,
	FOREIGN KEY (Group_Id) REFERENCES gp_db.Groups(Group_Id) ON DELETE CASCADE
);
CREATE TABLE gp_db.Groups(
	Group_Id INT auto_increment NOT NULL,
	Group_Name varchar(255) NOT NULL,
	Group_Owner INT NOT NULL,
	Date_Created Date NOT NULL,
	PRIMARY KEY (Group_Id),
	FOREIGN KEY (Group_Owner) REFERENCES gp_db.Users(User_Id) ON DELETE CASCADE
);

CREATE TABLE gp_db.Transactions(
	Transaction_Id INT auto_increment NOT NULL,
	Transaction_Owner INT NOT NULL,
	Transaction_Name varchar(255) NOT NULL,
	Date_Created Date NOT NULL,
	Status BOOL NOT NULL,
	Group_Id INT NOT NULL,
	PayTo varchar(100) NOT NULL,
	PRIMARY KEY (Transaction_Id),
	FOREIGN KEY (Transaction_Owner) REFERENCES gp_db.Users(User_Id) ON DELETE CASCADE,
	FOREIGN KEY (Group_Id) REFERENCES gp_db.Groups(Group_Id) ON DELETE CASCADE
);

CREATE TABLE gp_db.User_Transactions(
	Id INT auto_increment NOT NULL,
	User_Id INT NOT NULL,
	Transaction_Id INT NOT NULL,
	Amount_Owned FLOAT NOT NULL,
	Date_Payed DATE,
	Status BOOL NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (User_Id) REFERENCES gp_db.Users(User_Id) ON DELETE CASCADE,
	FOREIGN KEY (Transaction_Id) REFERENCES gp_db.Transactions(Transaction_Id) ON DELETE CASCADE
);




