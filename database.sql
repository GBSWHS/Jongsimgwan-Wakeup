create user wakeup@localhost;
create schema wakeup;

use wakeup;
grant all privileges on wakeup.* to wakeup@localhost;

create table user (
  id varchar(20) not null primary key,
  grade int not null,
  class int not null,
  num int not null,
  roomno int not null,
  nickname char(4) not null, 
  passwd char(64) not null,
  salt char(8) not null,
  student int(1) not null default 1
);

create table voted (
  id varchar(20) not null primary key,
  musicid varchar(20) not null,
  created_at timestamp default current_timestamp
);

create table musicid (
  id varchar(20) not null primary key,
  uploadby varchar(20) not null,
  duration varchar(10) not null,
  title varchar(100) not null,
  artist text,
  album text,
  created_at timestamp default current_timestamp
);