import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'this is content of First Post.'},
  //   {title: 'Second Post', content: 'this is content of Second Post.'},
  //   {title: 'Third Post', content: 'this is content of Third Post.'}
  // ];

  isLoading = false;
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(private postsServive: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsServive.getPosts();
    this.postsSub = this.postsServive.getPostUpdateListener()
      .subscribe( (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsServive.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
