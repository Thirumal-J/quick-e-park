-- drop view tbl_getparkdetails;
-- drop table tbl_parkdetails;
-- drop table tbl_vehicles;
-- drop table tbl_history;
-- drop table tbl_penalty;
-- drop table tbl_User;
--create table tbl_User (UID SERIAL PRIMARY KEY,parkingId serial,Name varchar,Surname varchar,Email varchar UNIQUE NOT NULL,Password varchar,mobileno int,licenseno varchar UNIQUE NOT NULL,ActiveStatus bit,RegDate TIMESTAMP default now());
-- create table tbl_parkdetails (UID int,ParkingActive bit,ParkingStartDate TIMESTAMP, ParkingEndDate TIMESTAMP,ParkingLocation varchar,ParkingFare decimal, ParkedCarRegNo varchar, parkingEmail varchar NOT NULL,paidStatus bit default '0',CONSTRAINT fk_useridpark FOREIGN KEY(UID) REFERENCES tbl_User(UID), notificationSent bit default '0');
-- create table tbl_vehicles (UID int,CarRegistrationNo varchar, CurrentActive bit, vehicleType varchar,CONSTRAINT fk_useridvhcl FOREIGN KEY(UID) REFERENCES tbl_User(UID));
-- create table tbl_history (UID int, Name varchar,Surname varchar,Email varchar,ParkingStartDate TIMESTAMP, ParkingEndDate TIMESTAMP,ParkingLocation varchar,ParkingFare int,ParkedCarRegNo varchar, parkingemail varchar,CONSTRAINT fk_useridhist FOREIGN KEY(UID) REFERENCES tbl_User(UID), notificationSent bit default '0');
-- create table tbl_penalty (UID int,ParkingFine decimal,CarRegistrationNo varchar NOT NULL,FineDate TIMESTAMP, paidstatus bit,CONSTRAINT fk_useridfine FOREIGN KEY(UID) REFERENCES tbl_User(UID));
--create view uv_getparkdetails as select uid,parkingid,parkingstartdate,case when (extract(epoch from (parkingenddate-now()) / 60 )<0) then '0' else concat(concat(floor(extract(epoch from (parkingenddate-now()) / 3600)), ' Hours '),concat((mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) ) , ' minutes')) end as timeremaining,mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) as timeremaininginminutes ,parkinglocation,concat(parkingfare, ' EUR ') as parkingfare,parkedcarregno, parkingEmail,notificationSent from tbl_parkdetails where parkingactive in('1') --and uid=1
--create view uv_totalfare as (select uid,parkingfare from tbl_parkdetails where parkingactive='0' and uid=3 and paidstatus='0' union all select uid,parkingfare from tbl_history where uid=3 and paidstatus='0')
--create table tbl_checker (CID int primary key , Name varchar, Surname varchar, Email varchar, Password varchar, ActiveStatus bit, RegDate timestamp default now(), location varchar)

-- CREATE or replace PROCEDURE sp_updateTransactions()
-- LANGUAGE SQL
-- AS $$
-- update tbl_parkdetails set parkingactive='0' where  floor(extract(epoch from (parkingenddate-now()) / 60))<=0;
-- insert into tbl_history select p.uid,u.name,u.surname,u.email,p.parkingstartdate,p.parkingenddate,p.parkinglocation,p.parkingfare,p.parkedcarregno,p.paidstatus,p.parkingemail,p.notificationSent from tbl_parkdetails p join tbl_user u on p.uid=u.UID where p.parkingactive='0';
-- delete from tbl_parkdetails tbl_parkdetails where parkingactive='0';
-- $$;

create view uv_totalfare as (select uid,parkingfare from tbl_parkdetails where parkingactive='0' and uid=3 and paidstatus='0' union all select uid,parkingfare from tbl_history where paidstatus='0')

insert into tbl_penalty values('1',1.5, '2020-12-25 15:34:55.352255')
select _ from tbl_parkdetails
select _ from tbl_penalty
drop view uv_getparkdetails
SELECT extract(epoch from ('2020-12-25 10:49:33.372601'-now()) / 60 )
--drop view uv_getparkdetails

--select \* from tbl_parkdetails;
--insert into tbl_parkdetails(uid,parkingstartdate) values(1,now())
--delete from tbl_parkdetails
"2020-12-31 15:17:13.822663"
"2020-12-31 15:22:13.822663"

select _ from uv_getparkdetails where timeremaining<'10' and notificationSent='0'
select notificationsent,parkingemail,_ from uv_getparkdetails

select floor(extract(epoch from (now()-now()) / 3600))   
select u.name,u.email,u.mobileno,p.carregistrationno,p.finedate,p.paidstatus,p.parkingfine from tbl_penalty p join tbl_user u on p.uid=u.uid where p.issuedcid in ('123456')

select now()

INSERT INTO tbl_user (Name,Surname,Email,Password,mobileno,licenseno,activestatus) VALUES ('Virat','Kohli', 'thirumaltce@gmail.com','7baf3fef89ec838c0f727b419811a015a2a02be89484b22e95ec03e712c3b81ad909b61a2be08218173f74d5eabb9619ee22bbf5984d099a28c2dfd0a9f779b5','15211874482','B072RRE2152','1' );

delete from tbl_user where uid=8
--"7baf3fef89ec838c0f727b419811a015a2a02be89484b22e95ec03e712c3b81ad909b61a2be08218173f74d5eabb9619ee22bbf5984d099a28c2dfd0a9f779b5"
--select \* from tbl_User;
--insert into tbl_user (name,surname,email,password) values('Sheharaz2','sheik','sheharaz207@gmail.com','Password')

SELECT carregistrationno,vehicletype FROM tbl_vehicles INNER JOIN tbl_user ON tbl_vehicles.uid=tbl_user.uid WHERE email='thirumal1206@gmail.com' ;

--drop table tbl_vehicles
select _ from tbl_vehicles
--insert into tbl_vehicles values (4,'DE YY1235','1','temporary')
select name,surname,email,parkingstartdate,parkingenddate,parkinglocation,parkingfare,parkedcarregno,paidstatus,parkingemail from tbl_penalty where uid in ('3')
select _ from (
select parkingfare from tbl_parkdetails where parkingactive='0' and uid=3 and paidstatus='0' union all
select parkingfare from tbl_history where uid=3 and paidstatus='0'
) as parking

delete from tbl_history
insert into tbl_history values (3 , 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test')

select \* from uv_totalfare

select \* from tbl_checkers

select \* from tbl_penalty

alter table tbl_penalty ALTER column issuedCID set not null ;

call sp_updateTransactions();
update tbl_parkdetails set parkingenddate=now() where uid=10
SELECT _ FROM pg_timezone_names where abbrev like '%530%'
select case when sum(parkingfine)>0 then sum(parkingfine) else '0' end from tbl_penalty where uid in ('3') and paidstatus='0'
select notificationsent,_ from tbl_parkdetails;
select _ from tbl_history
select _ from uv_getparkdetails
select now()
select name,surname,email,mobileno,location from tbl_checker where cid in ('123456')
select _ from tbl_parkdetails where parkedcarregno='DE YY1235'
select _ from tbl_history
select \* from tbl_checker
drop view uv_totalfare
alter table tbl_history alter column parkingfare type numeric

select \* from tbl_penalty
update tbl_penalty set paidstatus='1' where uid in ('3')
update tbl_penalty set paidstatus='0' where uid in ('3')

alter table tbl_checker add column mobileNo int

select \* from uv_totalfare

select case when sum(parkingfare)> 0 then sum(parkingfare) else '0' end from uv_totalfare where uid in ('3')

insert into tbl_checker values('123456','test','test','test@test.com','Password','1',now(),'test')
select parkingfare from uv_totalfare where uid in ('3')

select \* from tbl_checker

update tbl_checker set name='ajinkya',surname='rahane',email='test@quickepark.com',location='Duisburg'

select \* from uv_totalfare

create view uv_totalfare as (select uid,parkingfare from tbl_parkdetails where parkingactive='0' and uid=3 and paidstatus='0' union all select uid,parkingfare from tbl_history where uid=3 and paidstatus='0')

--create view uv_getparkdetails as select uid,parkingid,parkingstartdate,case when (extract(epoch from (parkingenddate-now()) / 60 )<0) then '0' else concat(concat(floor(extract(epoch from (parkingenddate-now()) / 3600)), ' Hours '),concat((mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) ) , ' minutes')) end as timeremaining,mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) as timeremaininginminutes ,parkinglocation,concat(parkingfare, ' EUR ') as parkingfare,parkedcarregno, parkingEmail,notificationSent from tbl_parkdetails where parkingactive in('1') --and uid=1

--create view uv_getparkdetails as select uid,parkingstartdate,case when (extract(epoch from (parkingenddate-now()) / 60 )<0) then '0' else concat(concat(floor(extract(epoch from (parkingenddate-now()) / 3600)), ' Hours '),concat((mod(cast(floor(extract(epoch from (parkingenddate-now()) / 60)) as int),60) ) , ' minutes')) end as timeremaining,parkinglocation,concat(parkingfare, ' EUR ') as parkingfare,parkedcarregno, parkingEmail,notificationSent from tbl_parkdetails where parkingactive in('1') --and uid=1
