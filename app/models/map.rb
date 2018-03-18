class Map < ApplicationRecord
	REDIS.set("global_bunkers", [[1500, 1700, "square"], [2000, 1743, "house"], [1300, 3000, "house1"], [4000, 4000, "house2"]]);

	REDIS.set("global_trees", [[300, 300, "tree_0"]])
end
