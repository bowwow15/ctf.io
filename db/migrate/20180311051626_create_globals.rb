class CreateGlobals < ActiveRecord::Migration[5.1]
  def change
    create_table :globals do |t|

      t.timestamps
    end
  end
end
