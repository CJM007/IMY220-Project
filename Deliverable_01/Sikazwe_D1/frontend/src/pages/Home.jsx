import Feed from "../components/Feed";
import { dummyPosts } from "../assets/dummyData";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Feed posts={dummyPosts} />
    </div>
  );
}

export default Home;
