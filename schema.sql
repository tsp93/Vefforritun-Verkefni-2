CREATE TABLE applications (
  name varchar(64) not null,
  email varchar(64) not null,
  phone int not null,
  text text not null,
  job varchar(14) not null,
  processed boolean default false,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);
