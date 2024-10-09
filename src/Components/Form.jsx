import { useEffect, useState } from "react";


function Form() {
  let [student, setStudent] = useState({});
  let [list, setList] = useState([]);
  let [index, setIndex] = useState(-1);
  let [error, setError] = useState({});
  let [hobby, setHobby] = useState([]);
  let [search, setSearch] = useState("");
  let [symbol, setSymbol] = useState("");
  let [currentPage, setCurrentpage] = useState(1);
  const itemperPage = 3;

  const indexOfLastItem = currentPage * itemperPage;
  const indexOfFirstItem = indexOfLastItem - itemperPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(list.length / itemperPage);

  useEffect(() => {
    let oldlist = JSON.parse(localStorage.getItem("studentlist")) || [];
    setList(oldlist);
  }, []);

  let handleInput = (e) => {
    let { name, value } = e.target;
    let newHobby = [...hobby];
    if (name === "hobby") {
      if (e.target.checked) {
        newHobby.push(value);
      } else {
        let pos = newHobby.findIndex((v) => v === value);
        newHobby.splice(pos, 1);
      }
      value = newHobby;
    }
    setHobby(newHobby);
    setStudent({ ...student, [name]: value });
  };

  let validationForm = () => {
    let tempErrors = {};
    if (!student.id) tempErrors.id = "Id is required.";
    if (!student.name) tempErrors.name = "Name is required.";
    if (!student.email) tempErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(student.email)) tempErrors.email = "Invalid Email.";
    if (!student.hobby) tempErrors.password = "Hobby is required.";
    ;
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!validationForm()) return;
    let newlist;
    if (index !== -1) {
      list[index] = student;
      newlist = [...list];
      setIndex(-1);
    } else {
      newlist = [...list, student];
    }
    setList(newlist);
    localStorage.setItem("studentlist", JSON.stringify(newlist));
    setStudent({});
    setHobby([]);
    console.log(student);
    
  };


  let deleteData = (pos) => {
    let oldlist = JSON.parse(localStorage.getItem("studentlist"));
    oldlist.splice(pos, 1);
    localStorage.setItem("studentlist", JSON.stringify(oldlist));
    setList(oldlist);
  };

  let editData = (pos) => {
    let editstud = list[pos];
    setStudent(editstud);
    setIndex(pos);
    setHobby(editstud.hobby);
  };

  let handleSearch = (e) => setSearch(e.target.value);

  let sortBy = (type) => {
    let newlist = [];
    if (type === "name") {
      newlist = symbol === "" || symbol === "^" ? list.sort((a, b) => b.name.localeCompare(a.name)) : list.sort((a, b) => a.name.localeCompare(b.name));
      setSymbol(symbol === "^" ? "v" : "^");
    } else if (type === "email") {
      newlist = symbol === "" || symbol === "^" ? list.sort((a, b) => b.email.localeCompare(a.email)) : list.sort((a, b) => a.email.localeCompare(b.email));
      setSymbol(symbol === "^" ? "v" : "^");
    }
    setList(newlist);
  };
// console.log(list);

  return (
    <>
      <h2 className="form-header">Student Registration</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Id</label>
          <input type="text" name="id" value={student.id || ""} onChange={handleInput} />
          {error.id && <span className="error-text">{error.id}</span>}
        </div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={student.name || ""} onChange={handleInput} />
          {error.name && <span className="error-text">{error.name}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={student.email || ""} onChange={handleInput} />
          {error.email && <span className="error-text">{error.email}</span>}
        </div>
        <div className="form-group">
          <label>Hobby</label>
          <div className="checkbox-group">
            <label><input type="checkbox" name="hobby" value="Dance" onChange={handleInput} checked={hobby.includes("Dance")} /> Dance</label>
            <label><input type="checkbox" name="hobby" value="Read" onChange={handleInput} checked={hobby.includes("Read")} /> Read</label>
            <label><input type="checkbox" name="hobby" value="Write" onChange={handleInput} checked={hobby.includes("Write")} /> Write</label>
            <label><input type="checkbox" name="hobby" value="Yoga" onChange={handleInput} checked={hobby.includes("Yoga")} /> Yoga</label>
          </div>
        </div>
        <div className="form-group">
          <input type="submit" className="btn-submit" value={index !== -1 ? "Edit Data" : "Add Data"} />
        </div>
      </form>

      <div className="search-section">
        <input type="text" className="search-input" placeholder="Search..." onChange={handleSearch} />
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Id</th>
            <th><button onClick={() => sortBy("name")}>Name {symbol}</button></th>
            <th><button onClick={() => sortBy("email")}>Email {symbol}</button></th>
            <th>Hobby</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.filter(val => {
            if (search === "") return val;
            return val.name.toLowerCase().includes(search.toLowerCase()) || val.email.toLowerCase().includes(search.toLowerCase());
          }).map((v, i) => (
            <tr key={i}>
              <td>{v.id}</td>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.hobby ? v.hobby.join(", ") : "No Hobby"}</td>
              <td>
                <button onClick={() => editData(i)}>Edit</button> || 
                <button onClick={() => deleteData(i)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5">
              <div className="pagination">
                {currentPage > 1 && <button onClick={() => setCurrentpage(currentPage - 1)}>Prev</button>}
                {[...Array(totalPage)].map((_, index) => (
                  <button key={index} onClick={() => setCurrentpage(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                    {index + 1}
                  </button>
                ))}
                {currentPage < totalPage && <button onClick={() => setCurrentpage(currentPage + 1)}>Next</button>}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Form;
