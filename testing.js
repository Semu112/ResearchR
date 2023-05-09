let nestedArray = [
	[1, 2, 3],
	[4, 5, 6]
]

for (let parent of nestedArray)
{
	console.log(parent[1]);
}