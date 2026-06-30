import { Room, RoomEvent, RemoteParticipant, LocalTrack, Track } from "livekit-client";

const livekitUrl = import.meta.env.VITE_LIVEKIT_URL || "";

export class VoiceChannel {
  private room: Room | null = null;
  private onParticipantJoin: ((id: string, name: string) => void) | null = null;
  private onParticipantLeave: ((id: string) => void) | null = null;

  constructor(
    private partyId: string,
    private token: string
  ) {}

  async connect(): Promise<void> {
    if (!livekitUrl) {
      console.warn("[livekit] VITE_LIVEKIT_URL not set. Voice chat unavailable.");
      return;
    }

    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      this.onParticipantJoin?.(participant.sid, participant.name || "Unknown");
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      this.onParticipantLeave?.(participant.sid);
    });

    await this.room.connect(livekitUrl, this.token);
  }

  async toggleMicrophone(): Promise<boolean> {
    if (!this.room) return false;
    const audioTracks = Array.from(this.room.localParticipant.audioTrackPublications.values());
    if (audioTracks.length > 0) {
      const track = audioTracks[0];
      if (track.isMuted) {
        await track.unmute();
        return true;
      } else {
        await track.mute();
        return false;
      }
    }
    return false;
  }

  async disconnect(): Promise<void> {
    this.room?.disconnect();
    this.room = null;
  }

  onJoin(cb: (id: string, name: string) => void): void {
    this.onParticipantJoin = cb;
  }

  onLeave(cb: (id: string) => void): void {
    this.onParticipantLeave = cb;
  }

  get isConnected(): boolean {
    return this.room?.isConnected ?? false;
  }
}
