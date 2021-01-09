create table tbl_User (UID SERIAL PRIMARY KEY,parkingId serial,Name varchar,Surname varchar,Email varchar UNIQUE NOT NULL,Password varchar,mobileno int,licenseno varchar UNIQUE NOT NULL,ActiveStatus bit,RegDate TIMESTAMP default now());
create table tbl_parkdetails (UID int,ParkingActive bit,ParkingStartDate TIMESTAMP, ParkingEndDate TIMESTAMP,ParkingLocation varchar,ParkingFare decimal, ParkedCarRegNo varchar, parkingEmail varchar NOT NULL,paidstatus bit default '0',CONSTRAINT fk_useridpark FOREIGN KEY(UID) REFERENCES tbl_User(UID), notificationSent bit default '0',parkingid serial);
create table tbl_vehicles (UID int,CarRegistrationNo varchar, CurrentActive bit, vehicleType varchar,CONSTRAINT fk_useridvhcl FOREIGN KEY(UID) REFERENCES tbl_User(UID));
create table tbl_history (UID int, Name varchar,Surname varchar,Email varchar,ParkingStartDate TIMESTAMP, ParkingEndDate TIMESTAMP,ParkingLocation varchar,ParkingFare int,ParkedCarRegNo varchar, parkingemail varchar,CONSTRAINT fk_useridhist FOREIGN KEY(UID) REFERENCES tbl_User(UID), notificationSent bit default '0', paidstatus bit default '0');
create table tbl_penalty (UID int,ParkingFine decimal,CarRegistrationNo varchar NOT NULL,FineDate TIMESTAMP, paidstatus bit,CONSTRAINT fk_useridfine FOREIGN KEY(UID) REFERENCES tbl_User(UID));
create  view uv_getparkdetails as select uid,parkingid,parkingstartdate,case when (extract(epoch from (parkingenddate-now()) / 60 )<0) then '0' else  concat(concat(floor(extract(epoch from (parkingenddate-now()) / 3600)), ' Hours '),concat((mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) ) , ' minutes'))  end as timeremaining,mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) as timeremaininginminutes		,parkinglocation,concat(parkingfare, ' EUR ') as parkingfare,parkedcarregno, parkingEmail,notificationSent from tbl_parkdetails where parkingactive in('1');
create view uv_totalfare as (select uid,parkingfare from tbl_parkdetails where parkingactive='0'  and paidstatus='0' union all select uid,parkingfare from tbl_history where  paidstatus='0');
create table tbl_checker (CID int primary key , Name varchar, Surname varchar, Email varchar, Password varchar, ActiveStatus bit, RegDate timestamp default now(), location varchar);

-- CREATE or replace PROCEDURE sp_updateTransactions()
-- LANGUAGE SQL
-- AS $$
-- update tbl_parkdetails set parkingactive='0' where  floor(extract(epoch from (parkingenddate-now()) / 60))<=0;
-- insert into tbl_history select p.uid,u.name,u.surname,u.email,p.parkingstartdate,p.parkingenddate,p.parkinglocation,p.parkingfare,p.parkedcarregno,p.paidstatus,p.parkingemail,cast(p.notificationSent as varchar)  from tbl_parkdetails p join tbl_user u on p.uid=u.UID where p.parkingactive='0';
-- delete from tbl_parkdetails tbl_parkdetails where parkingactive='0';
-- $$;
