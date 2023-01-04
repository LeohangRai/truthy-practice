import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class createTableTasks1672816008574 implements MigrationInterface {
  tableName = 'tasks';
  indexFields = ['title'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment'
          },
          {
            name: '_id',
            type: 'uuid',
            isUnique: true,
            isGenerated: true,
            generationStrategy: 'uuid'
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      }),
      false
    );
    for (const field of this.indexFields) {
      await queryRunner.createIndex(
        this.tableName,
        new TableIndex({
          name: `IDX_TASKS_${field.toUpperCase()}`,
          columnNames: [field]
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    for (const field of this.indexFields) {
      const index = `IDX_TASKS_${field.toUpperCase()}`;
      const keyIndex = table.indices.find(
        (fk) => fk.name.indexOf(index) !== -1
      );
      if (keyIndex) {
        await queryRunner.dropIndex(this.tableName, keyIndex);
      }
    }
    await queryRunner.dropTable(this.tableName);
  }
}
