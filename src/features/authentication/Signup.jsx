function Signup() {
  function handleSignup(e) {
    e.preventDefault();
    console.log(e.target.value[0]);
  }
  return (
    <div>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <div>
          <div>User ID</div>
          <input type="text" />
        </div>
        <div>
          <div>Password</div>
          <input type="password" />
        </div>
        <button
          type="submit"
          className="bg-slate-400 w-fit p-1 rounded cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
