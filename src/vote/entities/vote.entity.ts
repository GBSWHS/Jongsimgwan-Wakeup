import { MusicEntity } from 'src/music/entities/music.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity('vote')
export class VoteEntity {
  @PrimaryColumn({ name: 'user_id', type: 'int' })
    userId: number

  @Column({ name: 'music_id', type: 'varchar', length: 20 })
    musicId: string

  @ManyToOne(() => MusicEntity, (music) => music.votes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'music_id', referencedColumnName: 'id' })
    music: MusicEntity
}
