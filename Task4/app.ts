import axios from "axios";

async function fetchData() {
  const { data } = await axios.get(
    "https://test-share.shub.edu.vn/api/intern-test/input"
  );
  return data;
}

async function submitData(token: string, result: number[]) {
  await axios.post(
    "https://test-share.shub.edu.vn/api/intern-test/output",
    result,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

function solveProblem(
  data: number[],
  queries: { type: string; range: [number, number] }[]
) {
  const n = data.length;
  const type1 = new Array(n + 1).fill(0);
  const type2 = new Array(n + 1).fill(0);


  for (let i = 0; i < n; i++) {
    type1[i + 1] = type1[i] + data[i];
    type2[i + 1] = type2[i] + (i % 2 === 0 ? data[i] : -data[i]);
  }


  const results: number[] = [];

  for (const query of queries) {
    const [l, r] = query.range;

    if (query.type === "1") {
      results.push(type1[r + 1] - type1[l]);
    } else if (query.type === "2") {
      results.push(type2[r + 1] - type2[l]);
    }
  }

  return results;
}

async function main() {
  const { token, data, query } = await fetchData();

  const result = solveProblem(data, query);

  await submitData(token, result);

  console.log("Results submitted successfully.");
}

main().catch(console.error);
