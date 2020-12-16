import { Injectable } from '@angular/core';

export interface Credentials {
  // Customize received credentials here
  id: string,
  email: string;
  token: string;
}

export interface UserProfileModel {
  numOfRecords: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
  selected_params : string[];
}

const credentialsKey = 'credentials';
const userProfileModelKey = 'userProfileModel';
const userFavoritesKey = 'favorites';
const userNotesKey = 'userNotes';
const webDisplayDateKey = 'webDisplayDate';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;
  private _userProfileModel: UserProfileModel | null = null;
  private _favorites: string[] = [];
  private _userNotes: string;
  private _webDisplayDate: string;

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    const savedUserProfileModel = sessionStorage.getItem(userProfileModelKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }

    if(savedUserProfileModel) {
      this._userProfileModel = JSON.parse(savedUserProfileModel);
    }

    this._webDisplayDate = sessionStorage.getItem(webDisplayDateKey) || localStorage.getItem(webDisplayDateKey);

  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  get userProfileModel(): UserProfileModel | null {
    return this._userProfileModel;
  }

  get userFavorites(): string[] | null {
    return this._favorites;
  }

  get userNotes(): string | null {
    return this._userNotes;
  }

  get webDisplayDate(): string | null {
    return this._webDisplayDate;
  }

  /**
   * Gets token
   * @return The user access_token or null if the user is not authenticated.
   */
  getToken(): string | null {
    if(this._credentials){
      return this._credentials.token;
    }
    return null;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  /**
   * Sets the user profile.
   * The userProfileModel may be persisted across sessions
   * Otherwise, the credentials are only persisted for the current session.
   * @param userProfileModel The user ProfileModel.
   */
  setUserProfile(userProfileModel?: UserProfileModel) {
    this._userProfileModel = userProfileModel || null;

    if (userProfileModel) {
      const storage = sessionStorage;
      storage.setItem(userProfileModelKey, JSON.stringify(userProfileModel));
    } else {
      sessionStorage.removeItem(userProfileModelKey);
      localStorage.removeItem(userProfileModelKey);
    }
  }

  /**
   * Sets the user favorites.
   */
  setFavorites(favArr?: string[]) {
    this._favorites = favArr || null;

    if (favArr) {
      const storage = localStorage;
      localStorage.setItem(userFavoritesKey, JSON.stringify(favArr));
    } else {
      sessionStorage.removeItem(userFavoritesKey);
      localStorage.removeItem(userFavoritesKey);
    }
  }

  /**
   * Sets the user notes.
   */
  setUserNotes(userNotes?: string) {
    this._userNotes = userNotes || null;

    if (userNotes) {
      const storage = localStorage;
      localStorage.setItem(userNotesKey, userNotes);
    } else {
      sessionStorage.removeItem(userNotesKey);
      localStorage.removeItem(userNotesKey);
    }
  }

  /**
   * Sets Web Display Date
   */
  setWebDisplayDate(value?: string) {
    this._webDisplayDate = value || null;

    if (value) {
      const storage = localStorage;
      localStorage.setItem(webDisplayDateKey, value);
    } else {
      sessionStorage.removeItem(webDisplayDateKey);
      localStorage.removeItem(webDisplayDateKey);
    }
  }
}
