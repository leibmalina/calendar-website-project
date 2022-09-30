create user 'calendar_acc'@'localhost' identified by 'adIdc27ca';
grant select, insert, update, delete on calendar to calendar_acc@localhost;
create table accounts (
                          uid mediumint unsigned NOT NULL AUTO_INCREMENT,
                          name varchar(15) NOT NULL,
                          password varchar(255) NOT NULL,
                          primary key (`uid`)
);
create table events (
                        eid mediumint unsigned NOT NULL AUTO_INCREMENT,
                        owner_uid mediumint unsigned NOT NULL,
                        group_id mediumint unsigned, # user group id number (default null)
                        title varchar(50) NOT NULL,
                        date date NOT NULL,
                        time time NOT NULL,
                        duration smallint unsigned, # in minutes
                        primary key (eid),
                        foreign key (owner_uid) references accounts (uid),
                        foreign key (group_id) references user_groups (gid)
);
create table sharing (
                        eid mediumint unsigned NOT NULL,
                        receiver_uid mediumint unsigned NOT NULL,
                        primary key (eid, receiver_uid),
                        foreign key (eid) references events (eid),

create table user_groups (
                        gid mediumint unsigned NOT NULL AUTO_INCREMENT,
                        name varchar(50) NOT NULL,
                        primary key (gid)
                        unique key(name) # no duplicate user groups 
);
create table members (
                         uid mediumint unsigned NOT NULL,
                         gid mediumint unsigned NOT NULL,
                         primary key (uid, gid),
                         foreign key (uid) references accounts (uid),
                         foreign key (gid) references user_groups (gid)
);