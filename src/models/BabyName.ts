import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';


interface BabyNameAttributes {
  id: string;
  birth_year: number;
  gender: string;
  ethnicity: string;
  child_first_name: string;
  count: number;
  rank: number;
}

interface BabyNameCreationAttributes extends Optional<BabyNameAttributes, 'id'> {}

class BabyName extends Model<BabyNameAttributes, BabyNameCreationAttributes> implements BabyNameAttributes {
  public id!: string;
  public birth_year!: number;
  public gender!: string;
  public ethnicity!: string;
  public child_first_name!: string;
  public count!: number;
  public rank!: number;
}

BabyName.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    birth_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ethnicity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    child_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'baby_names',
    timestamps: false,
  }
);

export default BabyName;
