class Map < ApplicationRecord
	REDIS.set("global_bunkers", [[1500, 1700, "square"], [2000, 1743, "house"], [1300, 3000, "house1"], [4000, 4000, "house2"]]);

	REDIS.set("global_trees", [[300, 300, "tree_0"], [1482, 782, "tree_0"], [2155, 251, "tree_0"], [1937, 1425, "tree_0"], [3331, 293, "tree_0"], [3576, 807, "tree_0"], [1880, 2662, "tree_0"]])
end
