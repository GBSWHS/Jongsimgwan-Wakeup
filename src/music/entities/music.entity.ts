import { VoteEntity } from 'src/vote/entities/vote.entity'
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

@Entity('music')
export class MusicEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 20 })
    id: string

  @Column({ name: 'registrant', type: 'int', nullable: false })
    registrant: string

  @Column({ name: 'title', type: 'text', nullable: false })
    title: string

  @Column({ name: 'url', type: 'text', nullable: false })
    url: string

  @Column({ name: 'thumbnail', type: 'text', nullable: false })
    thumbnail: string

  @Column({ name: 'timestamp', type: 'text', nullable: false })
    timestamp: string

  @Column({ name: 'artist', type: 'text', nullable: true })
    artist: string

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

  @OneToMany(() => VoteEntity, (vote) => vote.music)
    votes: VoteEntity[]
}
