import React, {useState} from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [friendSelected, setFriendSelected] = useState(false)

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }
  function handleAddfriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }
  function handleSelection(friend) {
    //setFriendSelected(friend)
    setFriendSelected((cur) => cur?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === friendSelected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setFriendSelected(null)
  }
  

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList 
          friends={friends} 
          onSelection={handleSelection}
          friendSelected={friendSelected}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddfriend}/>}

        <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>
      { friendSelected && <FormSplitBill friend={friendSelected} onSplitBill={handleSplitBill}/>}
    </div>
  )
}

function FriendsList({friends, onSelection, friendSelected}) {

  return (
    <ul>
      {friends.map((friend) => (
        <Friend 
          friend={friend} 
          key={friend.id} 
          onSelection={onSelection}
          friendSelected={friendSelected}
        />
      ))}
    </ul>
  )
}
function Friend({friend, onSelection, friendSelected}) {
  const isSelected = friendSelected?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img 
        src={friend.image} 
        alt={friend.name}
      />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          you and {friend.name} are even
        </p>
      )}
      <Button onClick={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )

}
function Button({children, onClick}) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault()
    if(!name || !image) return;

    const id = crypto.randomUUID()
    const newFriend = {
      name, 
      image: `${image}?=${id}`, 
      balance: 0, 
      id: id
    }
    onAddFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label className="">Friend name👬</label>
    <input 
      type="text" 
      value={name} 
      onChange={e=> setName(e.target.value)}
    />

    <label>🌄Image URL</label>
    <input 
      type="text" 
      value={image} 
      onChange={e=> setImage(e.target.value)}
    />

    <Button>Add</Button>
  </form>
}
function FormSplitBill({friend, onSplitBill}) {
  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const [whoIsPaying, setWhoIsPaying] = useState("user")
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }
  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {friend.name}</h2>

    <label>💰Bill Value</label>
    <input 
      type="text" 
      value={bill} 
      onChange={e => setBill(Number(e.target.value))}
    />

    <label>🧍🏾‍♀️Your expenses</label>
    <input 
      type="text" 
      value={paidByUser} 
      onChange={e => 
        setPaidByUser(
          Number(e.target.value) > bill ? paidByUser :
          Number(e.target.value)

          )
        }
    />

    <label>👫{friend.name}</label>
    <input 
      type="text" 
      disabled 
      value={paidByFriend}
    />

    <label>🤑Who is paying the bill?</label>
    <select 
      value={whoIsPaying} 
      onChange={e => setWhoIsPaying(e.target.value)}
    >
      <option value='user'>You</option>
      <option value={friend.name}>{friend.name}</option>
    </select>


    <Button>Split bill</Button>
  </form>
}
export default App;