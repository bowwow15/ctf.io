class Map < ApplicationRecord
	REDIS.set("global_bunkers", [[1500, 1700, "square"], [2000, 1743, "house"], [1300, 3000, "house1"], [4000, 4000, "house2"]]);
end
