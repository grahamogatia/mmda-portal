import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

const users: User[] = [
  {
    id: 1,
    first_name: "kyle",
    last_name: "London",
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Doe",
  },
];

function Account() {
  const params = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const { id } = params;
    const user = users.find((user) => user.id === Number(id));
    if (!user) return;
    setUser(user);
  }, [params]);

  const onClick = () => {
    navigate("/home");
  };

  return (
    <div>
      <header className="flex justify-between">
        <p>My Account</p>
        <div>
          <button type="button" onClick={onClick}>
            Logout
          </button>
        </div>
      </header>
      <hr />
      {!params.id ? (
        <>id not found</>
      ) : !user ? (
        <>User not found</>
      ) : (
        <div>
          <p>First Name: {user.first_name}</p>
          <p>Last Name: {user.last_name}</p>
        </div>
      )}
    </div>
  );
}

export default Account;
