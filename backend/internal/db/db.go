package db

import (
	"context"
	"github.com/jackc/pgx/v5"
)

type User struct {
	Id    int
	Nick  string
	Pass  string
	Pow   string
	Email string
}

// insert new user in users table in db
// returns error
func InsertUser(conn *pgx.Conn, u User) error {
	var err error
	if u.Id == 0 {
		_, err = conn.Exec(context.Background(),
			`INSERT INTO users (username, password, pow, email)
			 VALUES ($1, $2, $3, $4)`,
			u.Nick, u.Pass, u.Pow, u.Email,
		)
	} else {
		_, err = conn.Exec(context.Background(),
			`INSERT INTO users (user_id, username, password, pow, email)
			 VALUES ($1, $2, $3, $4, $5)`,
			u.Id, u.Nick, u.Pass, u.Pow, u.Email,
		)
	}
	if err != nil {
		return err
	}
	return nil
}

// get User{} from db by its email
func GetUserByEmail(conn *pgx.Conn, email string) (User, error) {
	u := User{}
	err := conn.QueryRow(context.Background(),
		`SELECT user_id,
			username,
			password,
			pow,
			email
		FROM users WHERE email=$1`, email,
	).Scan(&u.Id, &u.Nick, &u.Pass, &u.Pow, &u.Email)
	if err != nil {
		return User{}, err
	}
	return u, nil
}

// get User{} from db by its id
func GetUserById(conn *pgx.Conn, id int) (User, error) {
	u := User{}
	err := conn.QueryRow(context.Background(),
		`SELECT user_id,
			username,
			password,
			pow,
			email
		FROM users WHERE user_id=$1`, id,
	).Scan(&u.Id, &u.Nick, &u.Pass, &u.Pow, &u.Email)
	if err != nil {
		return User{}, err
	}
	return u, nil
}
